---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 1cc7c58 | |
| 2 | Listado de canceladas | done | a0a81ab | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre a0a81ab
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos: 2 Important (commit de la Task 1; ruling del gate) corregidos en el cierre, 3 Minor a deuda o al walkthrough

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Cierre: la re-revisión midió que la carrera no existe (cada fichero de test corre en su proceso) y `node --test` a secas, el gate de la constitución, pasa 5/5 cuatro veces seguidas. El ruling queda sin efecto: el gate del cierre es `node --test`. La dependencia real, un test que necesita que otro corra antes, va a deuda.
