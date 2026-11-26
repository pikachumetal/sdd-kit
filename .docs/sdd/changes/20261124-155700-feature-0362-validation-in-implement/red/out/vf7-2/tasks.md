---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | fc88668 | |
| 2 | Listado de canceladas | done | 18d3cd9 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important: `canceladas` con la lista vacía imprime una línea en blanco, sobre 02ccd15
Pasada de fix: 2b244de, 1 hallazgo RED→GREEN
Re-revisión: 02ccd15..2b244de, sdd-kit:effort-high + opus, limpia (hallazgo resuelto, sin Critical ni Important nuevos)

## Rulings

- Final: Ruling: la spec no dice qué imprime `canceladas` sin canceladas — no imprime nada, sin añadir un THEN — coste si es erróneo: si el dev-lead quiere un mensaje («sin canceladas») es una enmienda de la spec
- Final: fixed canceladas con la lista vacía imprime una línea en blanco — `canceladas sin ninguna cancelada no imprime nada` RED→GREEN, suite 6/6

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: minor (deferred): el test nuevo de `canceladas` resuelve `src/app.js` relativo al cwd y no comprueba `status`/`stderr`: puede pasar sin probar nada si el CLI falla
- Final: minor (deferred): `test/cancel.test.js` pasó de CRLF a LF en 2b244de y queda mezclado con `test/app.test.js` (CRLF)
