---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | a656944 | |
| 2 | Listado de canceladas | done | 79d2a45 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 79d2a45
Re-revisión: juntada en el cierre (solo documentación tras 79d2a45), sdd-kit:effort-high + opus, 1 Important (commit de la Task 1 mal en la tabla → corregido a a656944) y 1 Minor (razón del Ruling de la Task 2 dudosa → diferido)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble — desmentido en el cierre: `node --test` ya aísla cada fichero en su proceso, la opción no cambia nada y el gate del cierre corre sin ella (ver walkthrough §3)
