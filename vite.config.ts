import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/dimsum-pameran/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  }
});

