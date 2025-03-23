import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/

// The original code is correct, but we can improve formatting and remove unnecessary commas.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
})
