---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | f697955 | |
| 2 | Listado de canceladas | done | fe348a0 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre fe348a0

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Minor (commit de la Task 1 mal citado: corregido a f697955) y 1 Important (ruling del gate sin fila de deuda: adjudicado, con su fila)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: la re-revisión pide registrar el `--test-concurrency=1` como relajación del gate de la constitución — no lo es: sigue corriendo el `node --test` entero y en verde, solo en serie — el gate se cumple; lo que faltaba era la fila de deuda del workaround, ya añadida en `debt.md` — coste si está mal: la suite tarda el doble hasta aislar el almacén
