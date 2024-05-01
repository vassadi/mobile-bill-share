import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mobile-bill-share/',
  build: {
    rollupOptions: {
      external: ['firebase-admin'],
    },
  },
});
