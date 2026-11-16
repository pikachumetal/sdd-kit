---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b1e206a | |
| 2 | Listado de canceladas | done | e58f3f0 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre e58f3f0
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 3 Important de documentación (commit de la Task 1, `### Confirmación` del ADR 0002, ruling del gate sin deuda) corregidos en el cierre y 1 Minor (ADR candidata solapada con 0014) a final; sin código tocado

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
