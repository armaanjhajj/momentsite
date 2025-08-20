import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Basic Vite configuration for a React project. The base option ensures relative
// asset paths work correctly when deployed from a subfolder.
export default defineConfig({
  plugins: [react()],
  base: './',
});