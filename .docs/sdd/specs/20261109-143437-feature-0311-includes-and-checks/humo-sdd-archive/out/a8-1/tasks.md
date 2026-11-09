---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | fd39ce6 | |
| 2 | Listado de canceladas | done | fd39ce6 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre fd39ce6
Re-revisión: lo posterior a fd39ce6, sdd-kit:effort-high + opus, un Important (falta el test del recorte)
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
