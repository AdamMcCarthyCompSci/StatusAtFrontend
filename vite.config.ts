import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    // Bundle analyzer - only runs when BUILD_ANALYZE=1 is set
    ...(process.env.BUILD_ANALYZE ? [visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })] : []),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon/favicon-v3.ico', 'favicon/apple-touch-icon-v3.png', 'favicon/favicon-v3.svg'],
      manifest: {
        name: 'StatusAt',
        short_name: 'StatusAt',
        description: 'Flow management and customer tracking application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'favicon/web-app-manifest-192x192-v3.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'favicon/web-app-manifest-512x512-v3.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'favicon/web-app-manifest-192x192-v3.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'favicon/web-app-manifest-512x512-v3.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['business', 'productivity'],
        screenshots: []
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\..*\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true, // Enable PWA in development for testing
        type: 'module'
      }
    })
  ],
  server: {
    open: true,
    port: 3000,
  },
  build: {
    // Optimize for production deployment
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps but don't reference them in JS bundle
    // This allows debugging without exposing source code to users
    sourcemap: 'hidden',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Simplified manual chunk splitting to avoid circular dependency issues
        manualChunks: {
          // Group React ecosystem together
          'vendor-react': ['react', 'react-dom'],
          // Keep router in a single chunk
          'vendor-router': ['react-router-dom'],
          // Query library
          'vendor-query': ['@tanstack/react-query'],
          // UI libraries
          'vendor-ui': ['framer-motion', 'lucide-react', '@heroicons/react'],
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
    // Enable tree-shaking
    target: 'esnext',
    modulePreload: {
      polyfill: false
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.tsx',
    // Ensure React runs in development mode for tests
    define: {
      'process.env.NODE_ENV': '"test"',
    },
  },
});