import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['lodash/debounce'] // Explicitly include lodash/debounce
  },
  build: {
    commonjsOptions: {
      include: [/lodash/, /node_modules/] // Ensure lodash is processed correctly
    }
  }
})