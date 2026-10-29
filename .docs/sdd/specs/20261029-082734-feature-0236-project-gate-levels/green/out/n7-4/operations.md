# Operations — Reservas

## Comandos

- **Build**: no declarado (no hay script `build`)
- **Arrancar**: `npm run dev` (vite)

## Testing

- **Suites**:
  - `unit` · `npm test` (vitest, `src/**/*.test.ts`) · duración pendiente · unitario
  - `e2e` · `npm run e2e` (playwright, `testDir: ./e2e`) · duración pendiente · E2E (la carpeta `e2e/` aún no existe, sin tests)
- **Lo afectado**: `npx vitest run --changed`
- **Gate de cierre**: `npm test`
- **Gate de merge**: `npm test`
- **Sin filtro**: `package.json`, `package-lock.json`, `vitest.config.*`, `playwright.config.*`, `tests/helpers/**`
- **Lint**: `npm run lint` (eslint, sin pre-commit); nunca en el gate
- **CI de la base**: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha`
- **Acceso a la aplicación**: pendiente
- **Motor de producción**: no aplica (los datos viven en memoria)
- **Temporales**: `unit` · no genera ficheros; `e2e` · `test-results/` (valor por defecto de Playwright) · propuesta `outputDir: '.temp/playwright'`
