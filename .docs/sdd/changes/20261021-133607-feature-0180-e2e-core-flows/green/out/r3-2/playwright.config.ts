import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  workers: 3,
  use: { baseURL: 'http://localhost:5173' },
});
