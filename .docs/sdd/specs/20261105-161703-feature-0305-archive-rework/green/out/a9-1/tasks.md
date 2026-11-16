---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | e807bdf | |
| 2 | Listado de canceladas | done | 0f73464 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 0f73464
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos (1 Important: la task 1 citaba 0f73464 y era e807bdf, corregido; 1 Minor: el flag del ruling, ver Rulings)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
