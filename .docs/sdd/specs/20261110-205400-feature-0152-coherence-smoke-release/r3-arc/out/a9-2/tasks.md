---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | c56253b | Commit corregido en el cierre: el registro citaba el de la Task 2 |
| 2 | Listado de canceladas | done | acbb1b4 | Test «cancelar sin motivo» añadido en el cierre (lo pedía la spec) |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre acbb1b4
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 3 hallazgos (2 Important, 1 Minor): 2 corregidos en el cierre, el del ruling constatado sin cambiar el gate
Pasada de fix: juntada en el cierre, 2 hallazgos (commit de la Task 1 y test sin motivo, que ya pasaba con el código)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Constatado en el cierre: no hay carrera entre ficheros (`node --test` corre cada fichero en su proceso y la suite pasa 6/6 igual con y sin `--test-concurrency=1`). Lo real es que el test `canceladas` depende del orden de `cancelar` dentro de `cancel.test.js`; el gate sigue siendo `node --test`. Deuda abierta en `debt.md`.
