---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3f967a9 | |
| 2 | Listado de canceladas | done | 98d82ba | |
| 3 | Fix de validación: `libres` vuelve a ofrecer la sala cancelada (regresión de 375994c) | done | 40f77e2 | RED `node --test test/cancel.test.js` → `Sur` en vez de `Norte, Sur`; GREEN 6/6 |

Revisión final: Spec opus+high, con fixes (1 Important) · Código sonnet+high, con fixes (3 Important) · Arquitectura no (plan: sin señales en el diff), sobre 7e35a66
Pasada de fix: 2dced14, 4 hallazgos arreglados (sin --motivo RED por mutación, sin reserva, 2 e2e fuera de flujos core, CRLF de src/app.js)
Re-revisión: 7e35a66..2dced14, sdd-kit:effort-high + opus, limpia (5/5 arreglados, sin rotura nueva)




## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: el test de `libres` va tras `canceladas` en `test/cancel.test.js` y depende de la cancelación del primer test, como el de la Task 2 — coste si es erróneo: falla si corre solo o en otro orden
- Task 3: Ruling: restablezco `status === 'active'` en `freeRooms` (src/app.js:7), el comportamiento previo a 375994c; ese commit no tenía task ni test y dejaba la sala cancelada ocupada — coste si es erróneo: una reserva anulada o cancelada vuelve a ofrecerse como libre
- Nota: 375994c convirtió `src/app.js` de CRLF a LF (el diff sale entero); lo dejo como está, a la vista de la revisión final
- Final: Ruling: Minors diferidos (acoplamiento por orden de los tests, literales de estado repetidos en app.js, reasonOf con una flag como valor, e2e de rechazo sin comprobar que la reserva queda intacta) — review.minors no es fix — coste si es erróneo: deuda menor en tests y app.js
