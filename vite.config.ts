import { defineConfig } from 'vite';
import fs from 'fs';

const inputs: Record<string, string> = {};

fs.readdirSync('.')
  .filter(file => file.endsWith('.html'))
  .forEach(file => {
    inputs[file.replace('.html', '')] = file;
  });

export default defineConfig({
  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,

    rollupOptions: {
      input: inputs,
      output: {
        entryFileNames: 'common/js/[name].js',
        chunkFileNames: 'common/js/[name].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? '';

          if (name.endsWith('.css')) {
            return 'common/css/main.css';
          }

          return 'common/assets/[name][extname]';
        }
      }
    }
  }
});