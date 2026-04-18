import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss(), ViteImageOptimizer({
    jpg: { quality: 80 },
    jpeg: { quality: 80 },
    png: { quality: 80 },
    webp: { lossless: true },
  })],
  resolve: {
    alias: {
      "#components": path.resolve(__dirname, './src/components'),
      "#constants": path.resolve(__dirname, './src/constants'),
      "#store": path.resolve(__dirname, './src/store'),
      "#hoc": path.resolve(__dirname, './src/hoc'),
      "#windows": path.resolve(__dirname, './src/windows'),
      "#lib": path.resolve(__dirname, './src/lib'),
      "@": path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion') || id.includes('motion')) {
              return 'vendor-motion';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('react-pdf')) {
              return 'vendor-pdf';
            }
            if (id.includes('lucide-react') || id.includes('radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react@') || id.includes('react-dom@')) {
              return 'vendor-react';
            }
            return 'vendor'; // all other node_modules
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
