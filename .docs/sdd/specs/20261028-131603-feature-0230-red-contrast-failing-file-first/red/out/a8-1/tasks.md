---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | d794ebb | |
| 2 | Listado de canceladas | done | d794ebb | |
| fix | Motivo sin espacios alrededor (pedido en la validación) | done | juntado en el cierre | sin test; ver el Ruling de la re-revisión |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre d794ebb
Re-revisión: juntada en el cierre, general-purpose + opus (sdd-kit:effort-high no existía en la sesión), 1 Important y 2 Minor abiertos, adjudicados en Rulings

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: Important de la re-revisión (el `.trim()` de `reasonOf` no tiene test que lo fije) — no hay segunda pasada de fix; queda como fila de deuda y como `sin test` en el walkthrough — coste si es erróneo: quitar el `.trim()` dejaría la suite en verde
- Final: Ruling: Minor de la re-revisión (el recorte amplía lo que la spec acepta y no consta en Enmiendas) — consta en el walkthrough como decisión sin el dev-lead; no edito a mano la spec aprobada ni la capacidad — coste si es erróneo: la capacidad `bookings` no describe el recorte
- Final: Ruling: Minor de la re-revisión (tasks.md no registraba el fix) — resuelto con la fila `fix` de la tabla
