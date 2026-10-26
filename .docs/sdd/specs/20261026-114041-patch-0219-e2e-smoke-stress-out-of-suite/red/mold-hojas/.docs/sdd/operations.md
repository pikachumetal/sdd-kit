# Operations — hojas

## Comandos

- **Build**: `npx vite build`
- **Arrancar**: `npm run api` y `npm run dev`

## Testing

- **Suites**: `componentes` · `npm test` · ~20 s; `e2e` · `npm run e2e` · ~8 min
- **Lo afectado**: `npx vitest run <fichero>`; `npx playwright test <fichero>`
- **Gate de cierre**: `npm test && npm run e2e`
- **Gate de merge**: `npm test && npm run e2e`
- **Acceso a la aplicación**: usuario del agente `agente@hojas.test` por `/dev/login`; quien valida usa `admin@hojas.test`
- **Motor de producción**: el API guarda en memoria en desarrollo y en los tests
- **Temporales**: `e2e` · `test-results/`
- **Flujos core**:
  - marcar una factura como cobrada · `e2e/0018-invoice-status.spec.ts` › marca una factura como cobrada
  - editar celdas de una hoja y que se guarden · `e2e/0012-sum-row.spec.ts` › la fila de total suma la columna
- **Presupuesto E2E**: `10 min`
- **Retries**: `0` en local y `2` en CI
- **Timeouts**: `por defecto`
- **Entorno de la suite**: `npm run api` y `npm run dev` · `curl -f http://localhost:5173`
- **Datos**: cada test usa su propia hoja (`demo` solo la usan los tests de la hoja)

## Frontend

- **URL**: `http://localhost:5173`
- **Detector**: `ninguno`
- **Viewports**: `1280x800`
- **Runner E2E**: Playwright, con el paquete `@playwright/test`
- **Acceso**: `/dev/login?user=agente@hojas.test&next={path}`, solo en desarrollo
- **Temas**: uno
- **Pantalla de referencia**: `/facturas`
- **Skills de apoyo**: ninguna
