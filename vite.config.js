import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '/backend',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8002', // Assurez-vous que le serveur PHP est sur ce port
    },
  },
})
