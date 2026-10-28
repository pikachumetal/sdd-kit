import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./test/temp-setup.ts'],
    // test/kit/headless/ solo corre dentro de kit:test-headless, que fija SDD_KIT_HEADLESS (0233).
    exclude: process.env.SDD_KIT_HEADLESS
      ? configDefaults.exclude
      : [...configDefaults.exclude, '**/kit/headless/**'],
  },
});
