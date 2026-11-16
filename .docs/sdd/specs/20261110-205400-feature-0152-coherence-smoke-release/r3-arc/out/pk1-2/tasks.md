---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3f9d431 | commit corregido en el cierre: el registro citaba 84a7c6e, que es el de la Task 2 |
| 2 | Listado de canceladas | done | 84a7c6e | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 84a7c6e
Re-revisión: 84a7c6e..juntada en el cierre, sdd-kit:effort-high + opus, 3 Important y 1 Minor (ver Rulings)
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate — **no se aplicó y no se sostiene**: la re-revisión del cierre y la sesión del cierre comprobaron que `node --test` (el gate de la constitución y del plan) pasa 5/5 tres veces sin el flag; `node --test` corre cada fichero en su subproceso, así que no hay carrera sobre el almacén. Lo que sí existe es un acoplamiento de orden dentro de `test/cancel.test.js` (`canceladas` depende de que el test anterior cancele Norte lun) — fila en «Por triar» de debt.md
- Final: fixed «sin --motivo sin test» — `cancelar sin motivo` RED→GREEN (en mutación), suite 6/6
- Final: Ruling: Task 1 con el commit equivocado en la fila — corregido en el registro — sin coste
- Final: minor (deferred): el test de motivo inválido usa Sur mar (reserva inexistente), no el GIVEN de la spec; no prueba que una reserva activa quede intacta — a debt.md
