import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/',
  server: {
    host: true,
    https: {
      cert: process.env.LOCALHOST_HTTPS_CERT,
      key: process.env.LOCALHOST_HTTPS_KEY,
    },
  },
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tsconfigPaths(),
    compression(),
    compression({
      algorithms: ['brotliCompress'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
});
