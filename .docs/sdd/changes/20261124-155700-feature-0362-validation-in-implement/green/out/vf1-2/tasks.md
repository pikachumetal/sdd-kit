---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 5086321 | |
| 2 | Listado de canceladas | done | b6510c5 | |
| 3 | Pasada de fix de la revisión final | done | 8c1c315 | |

Revisión final: Spec opus+high, con arreglos (1 Important, 3 Minor) · Código sonnet+high, con arreglos (3 Important, 3 Minor) · Arquitectura no (plan), sobre 298f790
Pasada de fix: 8c1c315, 4 hallazgos RED→GREEN
Re-revisión: 298f790..8c1c315, sdd-kit:effort-high + opus, limpia (3 Minor)

## Rulings

- Final: Eje Arquitectura: no en el plan (sin línea de cabecera) · señales en el diff: ninguna (package.json sin cambios contra la base; `reason` es un campo en memoria, sin esquema ni contrato entre módulos) → no sale
- Final: Ruling: `canceladas` y `reasonOf` sin más cuidado (mayúsculas exactas, parseo posicional) — la lista cerrada la decidió el dev-lead — coste si es erróneo: «Sala ocupada» se rechaza
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea en blanco
- Final: minor (deferred): constante para los estados `active`/`cancelled` y `cancelledList` en una línea de ~120 caracteres

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: minor (deferred): CRLF→LF en `test/cancel.test.js` y `e2e/cancel.e2e.mjs` (el resto del repo sigue en CRLF); el aislamiento `?canceladas` depende de que las reservas vivan en `app.js` (0014); el test sin `--motivo` usa Sur mar, no la reserva de la spec
- Final: minor (deferred): e2e a 30,1 s frente a 0,5 min por tests anteriores a la 0010; `operations.md` dice «~50 s»
