---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0d7508b | Corregido en el cierre: la fila decía 0083293 |
| 2 | Listado de canceladas | done | 0083293 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 0083293

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, hay que corregir → corregido en el cierre (solo `tasks.md`: commit de la Task 1 y el ruling de abajo)

## Rulings

- Ninguno vigente. Corrección del cierre: la línea original de la Task 2 anotaba `node --test --test-concurrency=1` en el gate contra «una carrera sobre el almacén compartido»; no se aplicó nunca (el gate sigue siendo `node --test`, sin enmienda del plan) y la causa no era una carrera: `node --test` corre cada fichero en su proceso, y lo que hay es una dependencia de orden dentro de `test/cancel.test.js` (el test de `canceladas` espera que el primero haya cancelado Norte lun). Pasa a deuda.
