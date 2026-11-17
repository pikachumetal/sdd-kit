# Operations — Reservas

## Comandos

- **Build**: no declarado (no hay script `build`)
- **Arrancar**: `npm run dev` (Vite)

## Testing

- **Suites**:
  - `unit` · `npm test` (vitest run) · duración pendiente · nivel pendiente
  - `e2e` · `npm run e2e` (Playwright, sin config ni tests todavía) · duración pendiente · nivel pendiente
- **Lo afectado**: no declarado
- **Gate de cierre**: pendiente
- **Gate de merge**: `npm test`
- **Sin filtro**: `package.json`
- **Lint**: ninguno
- **CI de la base**: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch main -L 1 --json conclusion,headSha`
- **Acceso a la aplicación**: no declarado
- **Motor de producción**: no aplica; los datos viven en memoria
- **Temporales**: `e2e` · `test-results/` (valor por defecto de Playwright) · propuesta `outputDir: '.temp/playwright'`; `unit` · no declarado
