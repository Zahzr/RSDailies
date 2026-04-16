import { defineConfig } from 'vite';

export default defineConfig({
  base: '/RSDailies/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
    open: true,
  },
  preview: {
    host: true,
    port: 4173,
    open: true,
  },
});