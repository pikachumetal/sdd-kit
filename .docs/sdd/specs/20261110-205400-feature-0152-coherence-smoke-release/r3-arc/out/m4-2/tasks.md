---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | d801781 | |
| 2 | Listado de canceladas | done | 9137a85 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 9137a85

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Crítico (`migrations/v3.0.0.md` fuera de alcance: «borra roadmap.md» borraría `ROADMAP.md`) arreglado revirtiendo a `e8552a4`, sin revisar · 2 Menores

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: el gate del plan y de la constitución es `node --test` y pasa 5/5 sin `--test-concurrency=1`; la carrera que motiva el ruling no se reproduce aquí — el ruling queda como workaround con su fila de deuda — coste si está mal: la suite tarda más
