import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/eigo/',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      plugins: [VitePWA({
        registerType: 'prompt',
        includeAssets: ['eigo-icon.svg'],
        manifest: {
          name: '英検4級 毎日学習', short_name: '英検4級', description: '中1復習から英検4級模試まで毎日続ける英語学習アプリ',
          theme_color: '#4f46e5', background_color: '#f8fafc', display: 'standalone', start_url: '/eigo/', scope: '/eigo/', lang: 'ja',
          icons: [{ src: '/eigo/eigo-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
        },
        workbox: { navigateFallback: '/eigo/index.html', globPatterns: ['**/*.{js,css,html,svg}'], cleanupOutdatedCaches: true },
      })],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
