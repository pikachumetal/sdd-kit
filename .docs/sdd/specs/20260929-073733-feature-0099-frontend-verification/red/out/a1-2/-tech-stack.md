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

- **URL**: `http://localhost:4642` (con `node server.mjs`).
- **Detector**: `npx impeccable@4.1.0 detect {url} --viewport {viewport}`; fallo con el código de salida 2.
- **Viewports**: `1280x800` y `390x844`.
- **Runner E2E**: Playwright 1.63 (el paquete, en `devDependencies`).

- **Temas**: claro por defecto; oscuro con `?theme=dark`.
- **Pantalla de referencia**: `/pedidos` (el listado).
- **Skills de apoyo**: ninguna.
