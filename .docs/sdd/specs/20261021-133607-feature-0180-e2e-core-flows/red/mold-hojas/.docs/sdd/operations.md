# Operations — hojas

## Comandos

- **Build**: `npx vite build`
- **Arrancar**: `npm run api` y `npm run dev`

## Testing

- **Suites**: `componentes` · `npm test` · ~20 s; `e2e` · `npm run e2e` · ~14 min
- **Lo afectado**: `npx vitest run <fichero>`; `npx playwright test <fichero>`
- **Gate de cierre**: `npm test && npm run e2e`
- **Gate de merge**: `npm test && npm run e2e`
- **Acceso a la aplicación**: usuario de pruebas `admin@hojas.test`, contraseña en `.env.test`
- **Motor de producción**: SQLite en los dos; el API arranca con una base vacía si `DB=memory`

## Frontend

- **URL**: `http://localhost:5173`
- **Detector**: `ninguno`
- **Viewports**: `1280x800`
- **Runner E2E**: Playwright, con el paquete `@playwright/test`
- **Acceso**: `/dev/login?user=admin@hojas.test&next={path}`, solo en desarrollo
- **Temas**: uno
- **Pantalla de referencia**: `/facturas`
- **Skills de apoyo**: ninguna
