import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/validate-key': {
            target: 'https://chump.blinkyink.com',
            changeOrigin: true,
            secure: false,
            rewrite: (_path) => '/webhook/validate-key',
            configure: (proxy) => {
              proxy.on('error', (err) => console.error('[proxy error]', err.message));
              proxy.on('proxyReq', (_req, req) => console.log('[proxy →]', req.method, req.url));
              proxy.on('proxyRes', (res, req) => console.log('[proxy ←]', res.statusCode, req.url));
            }
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
