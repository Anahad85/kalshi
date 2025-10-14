import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'main-board': resolve(__dirname, 'main-board.html'),
        'mamdani-totem': resolve(__dirname, 'mamdani-totem.html'),
        'cuomo-totem': resolve(__dirname, 'cuomo-totem.html'),
      },
    },
    // Optimize for Chromium 127
    target: 'chrome127',
    // Smaller chunks for better loading in Cnario player
    chunkSizeWarningLimit: 1000,
  },
})

