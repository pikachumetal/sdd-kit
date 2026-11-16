---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0640d0a | |
| 2 | Listado de canceladas | done | cf06c56 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre cf06c56

Re-revisión: cf06c56..a49449c, sdd-kit:effort-high + opus, 2 Important (commit de la task 1; Ruling del gate) corregidos en el cierre — corrección sin revisar

## Rulings

- Task 2: el Ruling inicial (`--test-concurrency=1` en el gate, por una supuesta carrera sobre el almacén) se retira: la re-revisión mostró que `node --test` a secas, el gate de la constitución, pasa 5/5, y cada fichero corre en su propio proceso. Lo que hay es un test que depende del orden de otro (`test/cancel.test.js`, «canceladas» tras «cancelar con un motivo de la lista»), anotado en `debt.md`.
