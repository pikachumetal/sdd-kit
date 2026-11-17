---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7507118 | |
| 2 | Listado de canceladas | done | c8fdf01 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre c8fdf01
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (el Ruling de la Task 2 fija un gate distinto al de la constitution) y 1 Minor (commit de la Task 1); el gate `node --test` a secas sale verde 8/8 y es el que corre el cierre; el commit de la Task 1 corregido

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
