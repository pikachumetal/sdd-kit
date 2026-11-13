---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | e75954d | |
| 2 | Listado de canceladas | done | c6e8fdb | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre c6e8fdb

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 hallazgos Important (commit de la Task 1; ruling sin aplicar) corregidos en el cierre y 1 Minor (workaround sin fila de deuda) → fila en `debt.md`

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble — **no aplicado**: `gate.json` y el gate del plan siguen sin el flag; la suite pasa igual (5/5), la carrera queda sin esquivar (deuda en `debt.md`)
