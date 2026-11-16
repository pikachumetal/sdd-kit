# Operations — Reservas

## Comandos

- **Build**: `no declarado` (no hay script `build`)
- **Arrancar**: `npm run dev` (vite; el puerto 3000 viene de `CLAUDE.md` y no está en la config de vite, sin verificar)

## Testing

- **Suites**:
  - `unit` · `npm test` (vitest run, `src/**/*.test.ts`) · pendiente · unitario
  - `e2e` · `npm run e2e` (playwright, `testDir: ./e2e`) · pendiente · E2E (la carpeta `e2e/` aún no existe, sin tests)
- **Lo afectado**: `no declarado`
- **Gate de cierre**: `npm test`
- **Gate de merge**: `npm test`
- **Sin filtro**: `package.json`, `package-lock.json`, `vitest.config.*`, `playwright.config.*`, `tests/helpers/**`
- **Lint**: `npm run lint` (eslint; nunca en el gate)
- **CI de la base**: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch main -L 1 --json conclusion,headSha`
- **Acceso a la aplicación**: `sin login` (sin verificar)
- **Motor de producción**: `no aplica` (los datos viven en memoria)
- **Temporales**: `e2e` · `test-results/` (por defecto de Playwright) · propuesta `outputDir: '.temp/playwright'`; `unit` · `no declarado`
