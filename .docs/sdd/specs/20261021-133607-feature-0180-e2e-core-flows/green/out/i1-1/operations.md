# Operations — Hojas

## Comandos

- **Build**: no declarado (`package.json` no tiene script de build)
- **Arrancar**: `npm run api` (API, puerto 3001) y `npm run dev` (Vite, puerto 5173)

## Testing

- **Suites**: `componentes` · `npm test` (Vitest) · duración pendiente; `e2e` · `npm run e2e` (Playwright) · duración pendiente
- **Lo afectado**: pendiente
- **Gate de cierre**: pendiente
- **Gate de merge**: pendiente
- **Acceso a la aplicación**: propuesta, a confirmar: página de desarrollo `/dev/login?user=admin@hojas.test&next=<ruta>`, la que usan hoy los E2E (`e2e/helpers.ts`). Esa ruta no existe todavía en `src/`. Usuario del agente distinto del de la persona que valida: pendiente.
- **Motor de producción**: pendiente (no hay base de datos; el servidor guarda en memoria)
- **Flujos core**: «marcar una factura como cobrada» · `e2e/0018-invoice-status.spec.ts` › marca una factura como cobrada
- **Presupuesto E2E**: pendiente
- **Retries**: `0` en local y `2` en CI (valor actual de `playwright.config.ts`)
- **Timeouts**: 60 s por test, sin motivo escrito (el valor por defecto de Playwright es 30 s)
- **Entorno de la suite**: pendiente. La suite necesita la API (3001) y Vite (5173) levantados; la config no tiene `webServer`.
- **Datos**: los tests no crean ni borran sus datos: escriben en la hoja `demo` del servidor y el estado dura mientras viva el proceso.

## Frontend

- **URL**: `http://localhost:5173`
- **Detector**: impeccable, recomendado: `npx impeccable@<versión> detect {url} --viewport {viewport}`, fallo con el código de salida 2. La versión está pendiente de fijar.
- **Viewports**: `1280x800` y `390x844`
- **Runner E2E**: Playwright (paquete `@playwright/test`)
- **Acceso**: el mismo `/dev/login?user=admin@hojas.test&next={path}` (a confirmar)
- **Temas**: no aplica (no hay temas)
- **Pantalla de referencia**: pendiente
- **Skills de apoyo**: ninguna
