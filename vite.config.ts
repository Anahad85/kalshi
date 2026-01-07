import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Kalshi API requests to bypass CORS in development
      '/api/kalshi': {
        target: 'https://api.elections.kalshi.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/kalshi/, '/trade-api/v2'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying:', req.method, req.url, '→', options.target + proxyReq.path);
          });
        },
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    // Optimize for Chromium 127
    target: 'chrome127',
    // Smaller chunks for better loading in Cnario player
    chunkSizeWarningLimit: 1000,
  },
})

