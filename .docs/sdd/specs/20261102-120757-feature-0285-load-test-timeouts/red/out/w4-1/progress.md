# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree enlazado en feature/0010-cancel-reason; env:setup hecho; línea base `node --test` 4/4 verde (worktree desacoplado, ya borrado); apertura commit 10f095c.
Aviso: la sesión carga el kit 2.3.4 y el proyecto pide el 3.0.0 (sdd-kit.json).

## Pre-flight scan
| Par / task | Qué produce → qué consume | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 (src/app.js) | T1 guarda `reason` en la reserva cancelada; T2 lista las de status `cancelled` leyéndolo | coherente; `voided` (0011) queda fuera del listado |
| T1 ↔ T2 (test/cancel.test.js) | ambas añaden tests; estado `bookings` en memoria compartido | T2 depende de que T1 deje Norte lun cancelada con «sala ocupada»: test de T2 debe cancelar por sí mismo (o fijar el orden) |
| T1 sola | spec: sin `--motivo` → «motivo no válido…»; test existente `cancelar una reserva activa` espera `cancelada Norte lun` sin motivo | contradice la spec: el test se actualiza a la spec (no es RED manipulado) |
| T1 sola | test existente `cancelar sin reserva` llama sin motivo y espera `sin reserva Sur mar`; la spec no dice qué gana | ver Ruling |
| T2 sola | plan sin «Se prueba en la aplicación»; el plan no tiene THEN propios | spec manda: «Norte lun — sala ocupada» |
| plan/spec | spec numera decisiones 1 y 3 (falta la 2) | observación, sin efecto |

Ruling: sin reserva gana sobre motivo inválido — la spec calla el orden y así `cancelar sin reserva` sigue verde sin tocarlo — si es erróneo cuesta invertir un `if` y un test
Ruling: el test `cancelar una reserva activa` pasa a usar `--motivo` — la spec manda «sin --motivo → motivo no válido» — si es erróneo cuesta reescribir un test
