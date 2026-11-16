---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 26447d7 | |
| 2 | Listado de canceladas | done | 68417c9 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 68417c9
Re-revisión: 68417c9..6965f53, sdd-kit:effort-high + opus, 2 Important y 1 Minor abiertos (Commit de la Task 1 en tasks.md, reescritura de migrations/v3.0.0.md, gate con --test-concurrency=1 sin deuda)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
