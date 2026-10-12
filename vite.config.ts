import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so the build works at user.github.io/FantasyTradeAI/ and on a custom domain
  base: './',
  plugins: [react()],
  // '::' is dual-stack: reachable as localhost, 127.0.0.1 and [::1] on Windows
  server: { host: '::', port: 5173 },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
