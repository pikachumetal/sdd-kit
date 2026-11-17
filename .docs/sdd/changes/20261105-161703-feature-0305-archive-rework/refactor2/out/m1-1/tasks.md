---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | e319ee1 | Commit corregido en el cierre: la fila citaba 422e85d |
| 2 | Listado de canceladas | done | 422e85d | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 422e85d
Re-revisión: juntada en el cierre, tramo de solo `.docs/`, sdd-kit:effort-high + opus, 1 Important (commit de la Task 1, corregido) y 2 Minor (Ruling, finales de línea)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: la re-revisión señala que esa carrera no existe (`node --test` ya aísla cada fichero en su subproceso; lo real es que el test `canceladas` depende del orden de los tests del fichero). El cierre corre el gate de la constitution, `node --test`, sin la opción — coste si es erróneo: ninguno, la suite sigue entera; la dependencia de orden queda en la deuda
