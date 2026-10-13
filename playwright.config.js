import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { channel: 'msedge', headless: true },
  workers: 1,
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true
  }
});
