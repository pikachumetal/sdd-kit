---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 2258ed2 | |
| 2 | Listado de canceladas | done | 555a940 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 555a940
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 hallazgos del registro (commit de la Task 1; ruling del gate) corregidos en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble · el gate.json no lo lleva: se aplicó a mano al correr la suite de cierre (6/6); deuda en el roadmap
