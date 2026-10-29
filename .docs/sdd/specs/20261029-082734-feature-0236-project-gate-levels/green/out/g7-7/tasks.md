---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | e532009 | |
| 2 | Listado de canceladas | done | 7df530a | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 7df530a
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (2 Minor, adjudicados)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: el workaround `--test-concurrency=1` sigue en pie aunque la re-revisión duda de su causa (cada fichero de test corre en su proceso y el almacén vive en memoria del módulo) — el gate de cierre (`gate.json`) no lo usa y la suite pasa sin él, así que no afecta al cierre — coste si es erróneo: un flag inútil donde se aplique; queda como deuda el confirmar la causa o aislar el almacén por test
