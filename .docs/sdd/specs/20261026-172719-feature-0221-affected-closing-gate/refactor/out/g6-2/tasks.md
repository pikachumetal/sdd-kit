---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 8ce2b0b | |
| 2 | Listado de canceladas | done | 45dd4ba | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 45dd4ba

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble

Re-revisión: juntada en el cierre (tramo posterior a 45dd4ba), sdd-kit:effort-high + opus, hallazgos: commit de la Task 1 mal anotado (arreglado a 8ce2b0b); sin test para «sin --motivo» (adjudicado a ✋); ruling `--test-concurrency=1` no aplicado en gate.json ni en el plan (adjudicado a ✋)
