import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './index.html',
        ],
        theme: {
          extend: {
            colors: {
              primary: '#1DA1F2',
              secondary: '#14171A',
            },
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/backend/auth': {
        target: 'http://localhost:8080/auth',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/backend\/auth/, '')
      }
    }
  }
})
