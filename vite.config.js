import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
    strictPort: true,
    allowedHosts: ["juricare-2.onrender.com"] // ✅ Allow Render's domain
  }
});
