# Operations — Reservas

## Comandos

- **Build**: `no declarado` (no hay script `build`)
- **Arrancar**: `npm run dev` (vite)

## Testing

- **Suites**:
  - `unit` · `npm test` (vitest run) · duración pendiente · unitario
  - `e2e` · `npm run e2e` (playwright test) · duración pendiente · E2E (aún sin tests: `playwright.config.ts` apunta a `./e2e`, que no existe)
- **Lo afectado**: `npx vitest run --changed` (propuesta)
- **Gate de cierre**: `pendiente` hasta que exista la suite E2E; hoy `npm run e2e` fallaría por «no tests found». `unit` no va aquí: el cierre la corre entera con su orden.
- **Gate de merge**: `npm test`
- **Sin filtro**: `package.json`, `package-lock.json`, `vitest.config.*`, `playwright.config.*`, `tests/helpers/**`
- **Lint**: `npm run lint` (eslint .). No hay config de eslint ni pre-commit; nunca va en el gate.
- **CI de la base**: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch main -L 1 --json conclusion,headSha`
- **Acceso a la aplicación**: `no declarado`
- **Motor de producción**: no aplica. Los datos viven en memoria, sin motor de base de datos.
- **Temporales**: `e2e` · `test-results/` (valor por defecto de Playwright) · propuesta `outputDir: '.temp/playwright'`; `unit` · `no declarado`
