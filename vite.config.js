import { defineConfig } from 'vite';

export default defineConfig({
  base: '/RSDailies/',
  root: 'src/index',
  publicDir: '../public',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: 'src/index/index.html'
    }
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