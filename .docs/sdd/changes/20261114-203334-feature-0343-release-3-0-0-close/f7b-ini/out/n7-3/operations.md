# Operations — Reservas

## Comandos

- **Build**: ninguno (no hay script `build`)
- **Arrancar**: `npm run dev`

## Testing

- **Suites**:
  - `unit` · `npm test` (vitest, `src/**/*.test.ts`) · duración pendiente · unitario
  - `e2e` · `npm run e2e` (Playwright, `testDir: ./e2e`) · duración pendiente · E2E (la carpeta `e2e/` aún no existe: suite sin tests)
- **Lo afectado**: `npx vitest run --changed`
- **Gate de cierre**: pendiente (la única suite con tests es unitaria, que el cierre corre entera con su orden; la E2E aún no tiene tests)
- **Gate de merge**: `npm test`
- **Sin filtro**: `package.json`, `package-lock.json`, `vitest.config.*`, `playwright.config.*`, `tests/helpers/**`
- **Lint**: `npm run lint` (`eslint .`); no hay config de eslint ni pre-commit. Nunca en el gate.
- **CI de la base**: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch main -L 1 --json conclusion,headSha`. Hoy el pipeline solo corre `npm test`, no la E2E.
- **Acceso a la aplicación**: no declarado
- **Motor de producción**: no aplica (los datos viven en memoria)
- **Temporales**:
  - `unit` · no declarado
  - `e2e` · `test-results/` (valor por defecto de Playwright) · propuesta `outputDir: '.temp/playwright'`
