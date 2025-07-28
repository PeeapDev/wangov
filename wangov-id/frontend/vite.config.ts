import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3003,
    host: '0.0.0.0', // More explicit than 'true' for binding to all interfaces
    strictPort: true, // Don't try other ports if 3003 is taken
    hmr: {
      host: 'localhost', // Required for HMR to work with subdomains
      port: 3003,
      clientPort: 3003 // Make sure client and server use same port
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  preview: {
    port: 3003,
    host: true,
  },
})
