import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // target: 'http://localhost:5004',
        target: 'https://activity-feed-dusky.vercel.app',
        changeOrigin: true
      }
    }
  }
})
