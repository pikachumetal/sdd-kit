---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 9eec474 | |
| 2 | Listado de canceladas | done | 5657042 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 5657042
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (ruling del gate) y 1 Minor (commit de la Task 1) resueltos en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Verificado en el cierre: sin el flag, `node --test` (el gate del plan) pasa 5/5, porque cada fichero de test corre en su propio proceso. El flag no hace falta y el gate de cierre es `node --test`. La dependencia de orden dentro de `test/cancel.test.js` pasa a la deuda.
