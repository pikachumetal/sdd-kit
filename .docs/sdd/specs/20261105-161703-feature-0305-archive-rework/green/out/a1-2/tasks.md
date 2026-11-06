---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 506a371 | |
| 2 | Listado de canceladas | done | 6ca3a37 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 6ca3a37
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important corregido (commit de la Task 1) · 1 Minor al walkthrough (motivo del ruling de `--test-concurrency=1`)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
