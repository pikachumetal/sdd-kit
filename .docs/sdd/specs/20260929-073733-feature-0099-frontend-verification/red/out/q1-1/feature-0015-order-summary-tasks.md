# Tasks — Resumen del pedido (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los datos del resumen | done | d8d25ee | |
| 2 | La tarjeta de resumen en la ficha | done | 121fef8 | revisada (limpia); verificación visual hecha, ver abajo; ruling 4511a45 |
| 3 | El listado enlaza cada pedido con su resumen | pending |  | |

## Verificación visual — Task 2

Playwright (paquete `playwright`), servidor propio en el puerto 4671, parado por el proceso que escuchaba. Capturas fuera de git en `scratchpad/runs/red/q1-1/shots/` (`1042-light|dark.png`, `1043-light|dark.png`).

| Estado · tema | Medida | Valor | Esperado |
| --- | --- | --- | --- |
| `/pedidos/1042` · claro y oscuro | tarjeta entre `h1` y tabla | sí | bajo la cabecera, antes de la tabla |
| `/pedidos/1042` · claro y oscuro | texto | Ferretería López · 1.240,00 € · Pendiente de envío | cliente, total y estado |
| `/pedidos/1043` · claro y oscuro | texto · «Enviar» | Talleres Ruiz · 0,00 € · Borrador · deshabilitado | tarjeta visible con «Enviar» deshabilitado |
| todos | borde de la tarjeta | claro `rgb(207,207,207)` · oscuro `rgb(68,68,68)` | sigue el tema |

Ruling (no cambia la spec): con `padding: 0` el texto quedaba pegado al borde; 4511a45 pone `padding: 12px 16px` y separa título y párrafos. Entra en la revisión final. Suite `node --test`: 4/4.
