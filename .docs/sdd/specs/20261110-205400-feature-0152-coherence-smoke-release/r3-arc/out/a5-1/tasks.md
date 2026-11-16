---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 153c83c | |
| 2 | Listado de canceladas | done | b1ee548 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre b1ee548
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 Important y 1 Minor (1 corregido, 1 ruling, 1 diferido)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: la fila 0016 (Fotos de las salas) con `parent: 0009` — es dato del roadmap que puso el dev-lead («partida en 0010 y 0016 (dev-lead)»), no del código ni de la spec; se deja y se pregunta en el mensaje final — coste si está mal: el «qué sigue» de la 0009 recomienda una pieza ajena
- Final: minor (deferred): tasks.md no sigue la plantilla (faltan `spec:`, `plan:`, `created:` ni la cabecera Spec/Plan/Rama)
