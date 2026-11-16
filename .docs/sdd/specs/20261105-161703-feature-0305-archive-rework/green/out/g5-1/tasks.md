---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0f67de6 | |
| 2 | Listado de canceladas | done | 9aaa317 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 9aaa317
Re-revisión: juntada en el cierre, tramo solo de documentación (tasks.md), sdd-kit:effort-high + opus, con hallazgos: Task 1 apuntaba a 9aaa317 (corregido a 0f67de6); el Ruling de la Task 2 describe un workaround que no está en el repo (ver walkthrough §3)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
