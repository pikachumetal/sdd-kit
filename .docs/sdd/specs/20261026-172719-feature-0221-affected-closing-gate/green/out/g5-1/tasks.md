---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 58bffbd | |
| 2 | Listado de canceladas | done | d16d30c | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre d16d30c
Re-revisión: juntada en el cierre (tramo d16d30c..cierre, sdd-kit:effort-high no disponible → general-purpose + opus), con hallazgos: 2, ambos en tasks.md, corregidos en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble — NO aplicado: ni `gate.json` ni el gate de `plan.md` llevan el flag en `d16d30c` (re-revisión del cierre); el ruling queda como intención sin efecto
