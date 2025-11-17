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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
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
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-maskable-512x512.png',
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
        // Improved manual chunk splitting for better caching and lazy loading
        manualChunks: (id) => {
          // Core vendor libraries
          if (id.includes('node_modules')) {
            // React core - keep React and ReactDOM strictly together
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('scheduler/')) {
              return 'vendor-react';
            }

            // Router
            if (id.includes('react-router-dom') || id.includes('@remix-run')) {
              return 'vendor-router';
            }

            // TanStack Query
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }

            // All Radix UI components in one chunk
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }

            // Framer Motion (animation library - large)
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }

            // i18next (internationalization)
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }

            // Icons
            if (id.includes('lucide-react') || id.includes('@heroicons')) {
              return 'vendor-icons';
            }

            // Utilities
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'vendor-utils';
            }

            // Date utilities
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }

            // Other smaller vendor libraries
            return 'vendor-misc';
          }
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