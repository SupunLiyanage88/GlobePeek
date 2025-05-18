import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import commonjs from '@rollup/plugin-commonjs'; // Proper import

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Force all lodash/debounce imports to use the specific package
      'lodash/debounce': 'lodash.debounce'
    }
  },
  optimizeDeps: {
    include: ['lodash.debounce'],
    exclude: ['lodash']
  },
  build: {
    rollupOptions: {
      external: ['lodash'],
      plugins: [
        commonjs() // Properly initialized plugin
      ]
    }
  }
});