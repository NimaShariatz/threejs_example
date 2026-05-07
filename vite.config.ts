import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use the repo name for GitHub Pages build, but use '/' for local development
  base: command === 'build' ? '/threejs_example/' : '/',
  build: {
    outDir: 'dist'
  }
}))