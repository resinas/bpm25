
import fs from 'fs';
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync('certificates/localhost+2-key.pem'),
      cert: fs.readFileSync('certificates/localhost+2.pem'),
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  base: "/icpm-navigator/",
  publicDir: 'public',
  build: {
    cssCodeSplit: true,
    minify: 'terser',
  }
})
