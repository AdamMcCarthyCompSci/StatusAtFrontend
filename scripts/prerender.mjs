/**
 * Post-build prerendering script.
 *
 * After `vite build` produces the SPA in dist/, this script:
 *  1. Starts a local static server on the dist/ folder
 *  2. Uses Puppeteer to visit each public route
 *  3. Waits for the page to fully render (networkidle0)
 *  4. Captures the rendered HTML and writes it to dist/<route>/index.html
 *
 * This gives crawlers (Google, Bing, social media) full HTML without executing JS,
 * while keeping the SPA experience intact for real users via hydration.
 */

import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = 4173;

// Public routes worth prerendering for SEO.
// Skip: / (auth-dependent redirect), dynamic param routes, authenticated routes.
const ROUTES = [
  '/home',
  '/pricing',
  '/how-it-works',
  '/demo',
  '/visa-services',
  '/law-services',
  '/privacy',
  '/terms',
  '/sign-in',
  '/sign-up',
];

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

/** Spin up a minimal static file server for the built SPA. */
function startServer() {
  const indexHtml = readFileSync(join(DIST_DIR, 'index.html'));

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let filePath = join(DIST_DIR, url.pathname);
    const ext = extname(filePath);

    // No file extension → SPA fallback to index.html
    if (!ext) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexHtml);
      return;
    }

    try {
      const content = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

async function prerender() {
  console.log('\n--- Prerendering static routes ---\n');

  const server = await startServer();
  console.log(`Static server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let failed = 0;

  for (const route of ROUTES) {
    try {
      console.log(`  Rendering ${route} ...`);
      const page = await browser.newPage();

      // Block heavy resources that aren't needed for HTML content
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'media', 'font'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30_000,
      });

      // Give lazy-loaded components a moment to resolve
      await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

      const html = await page.content();

      // Write to dist/<route>/index.html
      const outDir = join(DIST_DIR, route);
      const outFile = join(outDir, 'index.html');
      mkdirSync(outDir, { recursive: true });
      writeFileSync(outFile, html, 'utf-8');

      console.log(`    -> ${outFile}`);
      await page.close();
    } catch (err) {
      console.error(`  FAILED ${route}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPrerendered ${ROUTES.length - failed}/${ROUTES.length} routes.\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
