import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy só ativo em dev local — em produção (GitHub Pages) usa URL direta do N8N
    proxy: {
      '/n8n-api': {
        target: 'https://n8n-uzcu.srv1627758.hstgr.cloud',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/n8n-api/, '')
      }
    }
  }
})
