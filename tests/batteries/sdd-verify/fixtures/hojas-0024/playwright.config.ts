import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  workers: 3,
  retries: process.env.CI ? 2 : 0,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  use: { baseURL: 'http://localhost:5173' },
});
