import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Basic Vite configuration for a React project.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
    strictPort: true,
    host: 'localhost',
    open: false,
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: 'localhost',
    open: false,
  },
});