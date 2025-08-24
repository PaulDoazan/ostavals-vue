import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Use relative paths for GitHub Pages
  plugins: [
    vue(),
  ],
  css: {
    postcss: './postcss.config.js'
  }
})
