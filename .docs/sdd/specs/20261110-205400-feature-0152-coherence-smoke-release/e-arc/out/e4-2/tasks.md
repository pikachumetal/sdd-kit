---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | a140727 | |
| 2 | Listado de canceladas | done | 0f5dab0 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 0f5dab0

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 hallazgos Important: el commit de la Task 1 corregido en el cierre; el ruling de la Task 2 queda registrado, sin aplicar al gate

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. El cierre no lo aplicó: la suite pasó sin el flag, con el gate de `operations.md`
