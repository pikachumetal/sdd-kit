---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 59b48bd | |
| 2 | Listado de canceladas | done | 7914ac5 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 7914ac5
Re-revisión: 7914ac5..a770eab, sdd-kit:effort-high + opus, 2 Important y 3 Minor, todos de documentación, ajustados en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: el cierre corre el gate del plan, `node --test`, sin `--test-concurrency=1`: con y sin el flag la suite da 5/5, así que el workaround del Task 2 no se aplica; la causa real es el orden (el test de `canceladas` espera la cancelación del primer test) — coste si es erróneo: ninguno, el gate del plan ya pasa
