---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 072198c | sha corregido en el cierre: la re-revisión vio que apuntaba a 693cea1 |
| 2 | Listado de canceladas | done | 693cea1 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 693cea1
Re-revisión: juntada en el cierre, 2 hallazgos Important y 1 Minor sobre tasks.md, corregidos en el cierre · sdd-kit:effort-high + opus

## Rulings

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Nota del cierre: medido en el cierre, `node --test` también pasa 5/5; el motivo real es que `canceladas enseña sala, día y motivo` depende de la cancelación del primer test de `test/cancel.test.js`, no de una carrera. El gate de cierre es el del plan, `node --test`. Deuda en `debt.md`.
