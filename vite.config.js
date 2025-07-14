import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {},
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.jsx'),
      name: 'QdxInapp',
      fileName: 'qdx-inapp',
      formats: ['umd'],
    },
    rollupOptions: {
      output: {
        dir: path.resolve(__dirname, 'dist'),
        entryFileNames: 'qdx-inapp.umd.js',
      }
    }
  }
});
