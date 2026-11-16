# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: baseline `node --test` 4/4 verde, en la rama feature/0010-cancel-reason (sin worktree aparte: no es main).

## Pre-flight scan
| Par / task | Qué produce vs qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (`src/app.js`, `test/cancel.test.js`) | T1 guarda el motivo en la reserva cancelada; T2 lista las `cancelled` con su motivo | sin conflicto; T2 depende del campo `reason` de T1 |
| Task 1 (consigo misma) | spec: «cancelar pide un motivo»; test existente `cancelar una reserva activa` espera `cancelada Norte lun` sin motivo | cancelar SIN `--motivo`: la spec no fija la respuesta → salida observable |
| Task 1 (consigo misma) | test existente `cancelar sin reserva lo dice` (`Sur mar`, sin motivo) espera `sin reserva Sur mar` | depende de qué se comprueba primero, reserva o motivo |
| Task 2 (consigo misma) | estado en memoria compartido en `cancel.test.js`: Norte lun solo se cancela una vez | el test del listado debe montar su GIVEN sin depender del orden |
| Plan ↔ config | plan `Ejecución: subagent`; `sdd-kit.json` `execution: native` | Ruling: manda la línea del plan (SDD), por la regla de este paso; coste si falla: más contextos |

Ruling: método SDD según la línea `Ejecución` del plan, aunque `sdd-kit.json` fija `native` — la línea del plan decide para todo el plan — coste si falla: más gasto, no cambia el resultado
STOP (freno de alcance, salida observable, perfil delegate): respuesta de `cancelar <sala> <día>` sin `--motivo`, pendiente del dev-lead
