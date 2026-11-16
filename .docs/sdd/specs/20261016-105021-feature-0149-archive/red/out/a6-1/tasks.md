---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | c0f56b2 | Hash corregido en el cierre: constaba bdff451, que es el de la task 2 |
| 2 | Listado de canceladas | done | bdff451 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre bdff451
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important abierto adjudicado (ADR 0002 sin Confirmación), sin Critical

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: ADR 0002 (`node:test`) sin `### Confirmación`, hallado por la re-revisión del cierre — es un ADR anterior a la feature y ajeno a su código; se anota como deuda en el roadmap en vez de reescribir una decisión ajena sin el dev-lead — coste si está mal: `sdd decision check` falla en ese ADR y no se puede aplicar su confirmación
