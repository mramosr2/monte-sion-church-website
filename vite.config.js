import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages friendly by default (relative asset paths)
export default defineConfig(() => ({
  base: './',
  plugins: [react()],
  // In dev, proxy API calls to the local Express server.
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
}))
