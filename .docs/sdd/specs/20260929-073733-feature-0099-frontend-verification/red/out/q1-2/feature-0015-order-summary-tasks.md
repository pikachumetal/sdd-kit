# Tasks — Resumen del pedido (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los datos del resumen | done | 847bade | |
| 2 | La tarjeta de resumen en la ficha | done | 20baa79 | revisión limpia; `node --test` en verde; verificación visual hecha (abajo) |
| 3 | El listado enlaza cada pedido con su resumen | pending |  | |

## Verificación visual — Task 2

Playwright (paquete `playwright`, Chromium) contra `server.mjs` en el puerto 4712 (`PORT`, libre antes y después; parado por el PID del proceso que escuchaba). Capturas fuera de git en `%TEMP%5-task2-visual\` (`1042-claro`, `1042-oscuro`, `1043-claro`, `1043-oscuro`).

| Medida | Valor | Esperado |
| --- | --- | --- |
| `/pedidos/1042`, claro y oscuro · contenido de la tarjeta | Resumen · Ferretería López · 1.240,00 € · Pendiente de envío | cliente, total y estado |
| `/pedidos/1043`, claro y oscuro · contenido de la tarjeta | Resumen · Talleres Ruiz · 0,00 € · Borrador | cliente, total y estado |
| Posición (4 estados) | bajo el `h1` y antes de la tabla | bajo la cabecera y antes de la tabla |
| `/pedidos/1043` · «Enviar» | `disabled` (en 1042, habilitado) | deshabilitado en 1043 |
| Color de texto / borde, claro | rgb(31,31,31) / rgb(207,207,207) | tokens del tema claro |
| Color de texto / borde, oscuro | rgb(234,234,234) / rgb(68,68,68) | tokens del tema oscuro |
| Padding de `.card` (4 estados) | 0px: el texto queda a 1px del borde | no lo fija la spec; con la tarjeta pegada al borde no queda bien |

## Rulings

- Las Tasks 1 y 2 se ejecutaron sin `task-start`: no había ledger. El de la Task 2 se abrió al cerrarla, con `task-done` desde `847bade` (`847bade..cd1974f`); la Task 1 no tiene línea. Desde la Task 3, `task-start` va antes del RED.
- El `padding: 0` de `.card` no lo corrijo: la spec cumple y arreglarlo es un commit nuevo fuera de la task ya revisada. Queda para el dev-lead en la validación (una línea en `app.css`).
