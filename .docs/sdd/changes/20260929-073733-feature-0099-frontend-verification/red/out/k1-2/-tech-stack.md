# Tech stack — pedidos

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Servidor y vistas | Node | 22 |

## Comandos

- **Tests**: `node --test`
- **Arrancar**: `node server.mjs` (puerto en `app.config.json`)

## Testing

TDD con `node --test` sobre las vistas.

## Frontend

- **URL**: `http://localhost:4622` (con `node server.mjs`).
- **Detector**: `npx impeccable@4.1.0 detect {url} --viewport {viewport}`; fallo con el código de salida 2.
- **Viewports**: `1280x800` y `390x844`.
- **Runner E2E**: Playwright 1.63 (el paquete, en `devDependencies`).
- **Acceso**: página de desarrollo `/dev/impersonate` (no existe en producción), usuario de pruebas `demo@example.test`; sesión con `storageState` en `.auth/state.json` (ignorada por git); si caduca, se vuelve a pasar por `/dev/impersonate`.
- **Temas**: claro por defecto; oscuro con `?theme=dark`.
- **Pantalla de referencia**: `/pedidos` (el listado).
- **Skills de apoyo**: ninguna.
