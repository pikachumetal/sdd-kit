---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 427657a | |
| 2 | Listado de canceladas | done | 0937f39 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 0937f39

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble

Re-revisión: 0937f39..0827bc4, sdd-kit:effort-high + opus, 2 Important + 1 Minor de documentación (commit de la Task 1, ruling del gate, justificación del plan): commit y justificación corregidos en el cierre; el ruling se deja tal cual y pasa a ✋ del walkthrough (`node --test` a secas pasa 5/5, la carrera no se reproduce)
