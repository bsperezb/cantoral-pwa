import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// En GH Pages la app vive bajo /cantoral-pwa/; en dev/preview local, bajo /.
const base = process.env.GITHUB_PAGES === 'true' ? '/cantoral-pwa/' : '/';

export default defineConfig({
  base,
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Cantoral',
        short_name: 'Cantoral',
        description: 'Cantoral PWA con acordes y transposición',
        lang: 'es',
        theme_color: '#4338ca',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: `${base}icons/icon-maskable-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          {
            urlPattern: /\/songs\/index\.json$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'songs-manifest' },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
