# Tasks — Resumen del pedido (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los datos del resumen | done | fc2acba | |
| 2 | La tarjeta de resumen en la ficha | done | 6304eab |  |
| 3 | El listado enlaza cada pedido con su resumen | done | b42dfa3 | |

Revisión final: sdd-kit:effort-high + opus, limpia, sobre b42dfa3
Verificación visual (task 2), 2026-09-29: playwright/chromium, `/pedidos/1042` y `/pedidos/1043` en claro y oscuro; tarjeta bajo la cabecera y antes de la tabla; contraste texto/fondo 16,5:1 claro y 15,0:1 oscuro (≥ 4,5:1); «Enviar» deshabilitado en 1043. Capturas fuera de git (scratchpad/smoke-0015). Las capturas no las he abierto yo: las medidas salen de estilos computados.
