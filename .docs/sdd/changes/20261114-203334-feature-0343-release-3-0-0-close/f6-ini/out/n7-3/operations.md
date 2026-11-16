# Operations — Reservas

> Cómo se ejecuta y se verifica el proyecto. Sin versiones (están en los manifests: `package.json`, `*.csproj`…) ni decisiones pendientes (van al roadmap); el README enlaza este documento, no lo duplica. El comportamiento observable (tiempos, límites, cuotas, avisos, respuestas, estados) vive solo en `capabilities/`. Es un documento de estado: se reescribe, no se le añade.

## Comandos

- **Build**: `no declarado`
- **Arrancar**: `npm run dev`

## Testing

- **Suites**:
  - `unit` · `npm test` · duración pendiente · unitario
  - `e2e` · `npm run e2e` · duración pendiente · E2E
- **Lo afectado**: `no declarado`
- **Gate de cierre**: `pendiente`
- **Gate de merge**: `npm test`
- **Sin filtro**: `package.json`, `package-lock.json`, `vitest.config.*`, `playwright.config.*`, `tests/helpers/**`
- **Lint**: `npm run lint` (`eslint .`), sin pre-commit; nunca en el gate
- **CI de la base**: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch main -L 1 --json conclusion,headSha`
- **Acceso a la aplicación**: `sin login`
- **Motor de producción**: `no aplica` (los datos viven en memoria)
- **Temporales**:
  - `unit` · `no declarado`
  - `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`
