import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [react(), svgr({ svgrOptions: { icon: true } })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
