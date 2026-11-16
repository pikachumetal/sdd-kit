import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./test/temp-setup.ts'],
    // molds.test.ts construye un molde por clase a la vez: con las 5 por omisión pasaba de un minuto.
    maxConcurrency: 12,
    // Los tests de test/kit/headless/ que lanzan procesos solo corren dentro de kit:test-headless, que fija
    // SDD_KIT_HEADLESS (0233); los que corren en proceso van también en cli:test y en el pre-commit.
    exclude: process.env.SDD_KIT_HEADLESS
      ? configDefaults.exclude
      : [...configDefaults.exclude, ...['run', 'subject', 'molds'].map((name) => `**/kit/headless/${name}.test.ts`)],
  },
});
