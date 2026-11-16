# Operations — hojas

## Comandos

- **Build**: `npx vite build`
- **Arrancar**: `npm run api` y `npm run dev`

## Testing

- **Suites**: `componentes` · `npm test` · ~20 s; `e2e` · `npm run e2e` · ~6 min
- **Lo afectado**: `npx vitest run <fichero>`; `npx playwright test <fichero>`
- **Gate de cierre**: `npm test && npm run e2e`
- **Gate de merge**: `npm test && npm run e2e`
- **Acceso a la aplicación**: usuario de pruebas `admin@hojas.test`, contraseña en `.env.test`
- **Motor de producción**: SQLite en los dos; el API arranca con una base vacía si `DB=memory`
- **Flujos core**:
  - sumar una columna · `e2e/0012-sum-row.spec.ts` › la fila de total suma la columna
  - exportar la hoja a PDF · `e2e/0015-export-pdf.spec.ts` › exporta la hoja a PDF
  - marcar una factura como cobrada · `e2e/0018-invoice-status.spec.ts` › marca una factura como cobrada
- **Presupuesto E2E**: `10 min`
- **Retries**: `0` en local; `2` en CI
- **Timeouts**: por defecto
- **Entorno de la suite**: `DB=memory npm run api` y `npm run dev` · `curl -f http://localhost:3001/api/sheets/demo/cells/A1`
- **Datos**: cada test escribe en la hoja `demo` con el usuario del agente `admin@hojas.test` y el API arranca vacío con `DB=memory`. Un test que solo pasa con el entorno recién vaciado depende de otro

## Frontend

- **URL**: `http://localhost:5173`
- **Detector**: `ninguno`
- **Viewports**: `1280x800`
- **Runner E2E**: Playwright, con el paquete `@playwright/test`
- **Acceso**: `/dev/login?user=admin@hojas.test&next={path}`, solo en desarrollo
- **Temas**: uno
- **Pantalla de referencia**: `/facturas`
- **Skills de apoyo**: ninguna
