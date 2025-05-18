import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Force all lodash/debounce imports to use the specific package
      'lodash/debounce': 'lodash.debounce',
      // Alternative if using lodash-es
      'lodash/debounce': 'lodash-es/debounce'
    }
  },
  optimizeDeps: {
    include: [
      'lodash.debounce',
      'lodash-es/debounce'
    ],
    exclude: ['lodash'] // Prevent duplicate bundling
  },
  build: {
    rollupOptions: {
      external: ['lodash'], // Externalize lodash completely
      plugins: [
        // Add rollup plugin to handle commonjs if needed
        require('@rollup/plugin-commonjs')()
      ]
    }
  }
});