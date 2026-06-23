import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environmentMatchGlobs: [
      ['server/**', 'node'],   // los tests del backend no necesitan navegador simulado
      ['src/**', 'jsdom']      // los tests de componentes Vue sí lo necesitan
    ]
  }
})