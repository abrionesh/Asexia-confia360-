import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { build as esbuild } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverEntry = path.resolve(__dirname, 'server.ts');
const serverOutfile = path.resolve(__dirname, 'dist-server/server.mjs');

function serverEntryBuildPlugin(): Plugin {
  let built = false;
  return {
    name: 'server-entry-esm-build',
    apply: 'build',
    async closeBundle() {
      if (built) return;
      built = true;
      await esbuild({
        entryPoints: [serverEntry],
        bundle: true,
        platform: 'node',
        format: 'esm',
        outfile: serverOutfile,
        external: ['vite', 'express', 'dotenv', '@google/genai', 'ws'],
      });
    },
  };
}

export default defineConfig(() => {
  return {
    root: __dirname,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          lang: 'es',
          name: 'AsexIA Confia360 - Suite Digital y Operaciones Offline',
          short_name: 'Confia360',
          description: 'PWA offline-first para hostelería y pymes: fichaje cero-toque, OCR de tickets y agentes IA supervisados.',
          theme_color: '#022853',
          background_color: '#F3F7FA',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,woff,woff2}'],
          globIgnores: ['**/assets/aistudio/**'],
          navigateFallbackDenylist: [/^\/api/, /^\/ws/],
          runtimeCaching: [
            {
              urlPattern: /\/api\/gemini\/.*/i,
              handler: 'NetworkFirst',
              method: 'GET',
              options: {
                cacheName: 'gemini-api-get-cache',
                networkTimeoutSeconds: 8,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/api\/gemini\/.*/i,
              handler: 'NetworkFirst',
              method: 'POST',
              options: {
                cacheName: 'gemini-api-post-cache',
                networkTimeoutSeconds: 8,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
                plugins: [
                  {
                    handlerWillStart: async ({ request }) => {
                      try {
                        const store =
                          ((globalThis as Record<string, unknown>).__geminiPostKeys as WeakMap<Request, string> | undefined) ||
                          new WeakMap<Request, string>();
                        (globalThis as Record<string, unknown>).__geminiPostKeys = store;
                        const bodyText = await request.clone().text();
                        let hash = 2166136261;
                        for (let i = 0; i < bodyText.length; i++) {
                          hash ^= bodyText.charCodeAt(i);
                          hash = Math.imul(hash, 16777619);
                        }
                        const url = new URL(request.url);
                        url.searchParams.set('_sw_post_hash', (hash >>> 0).toString(16));
                        store.set(request, url.toString());
                      } catch {
                        // Ignore body read failures and fall back to request URL
                      }
                    },
                    cacheKeyWillBeUsed: async ({ request }) => {
                      const store = (globalThis as Record<string, unknown>).__geminiPostKeys as WeakMap<Request, string> | undefined;
                      const syntheticUrl = store?.get(request) || request.url;
                      return new Request(syntheticUrl, { method: 'GET' });
                    },
                  },
                ],
              },
            },
            {
              urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
              handler: 'NetworkFirst',
              method: 'GET',
              options: {
                cacheName: 'gemini-external-api-cache',
                networkTimeoutSeconds: 8,
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/api\/health$/i,
              handler: 'NetworkFirst',
              method: 'GET',
              options: {
                cacheName: 'api-health-cache',
                networkTimeoutSeconds: 5,
                expiration: {
                  maxEntries: 5,
                  maxAgeSeconds: 60 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              method: 'GET',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              method: 'GET',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      serverEntryBuildPlugin(),
    ],
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': __dirname,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
