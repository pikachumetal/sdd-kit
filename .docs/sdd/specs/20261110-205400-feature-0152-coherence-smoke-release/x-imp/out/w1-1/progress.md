# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree ya enlazado (feature/0010-cancel-reason); env:setup corrido (marcador .sdd-env.json, sin ignorar por git: no se commitea); línea base `node --test` en worktree desacoplado → 4/4 verde, retirado.
Setup: sin herramienta de subagentes en este harness → método Native, revisión final sin tipo sdd-kit:effort-<nivel> disponible («effort: no disponible en este harness, hereda el de la sesión»).

## Pre-flight scan

| Par / task | Qué produce vs qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (`src/app.js`) | T1 guarda `reason` en la reserva cancelada; T2 lista `status === 'cancelled'` con ese `reason` | Coherente: T2 consume el campo que T1 crea. |
| Task 1 ↔ Task 2 (`test/cancel.test.js`) | `bookings` es estado en memoria del módulo | El test de T2 debe cancelar dentro de su propio test (no depender del de T1). |
| Task 1 (texto propio) | Los dos tests existentes de cancelar esperan `cancelada Norte lun` sin motivo | Choca con la spec (sin `--motivo` → «motivo no válido…»): T1 actualiza ese test, y el fichero está en su lista. |
| Task 1 (texto propio) | La spec no dice el orden entre «sin reserva» y «motivo no válido» | Ver Ruling. |
| Task 2 (texto propio) | Verificación y ficheros coherentes con la spec | Sin hallazgos. |

Ruling: validar la reserva antes que el motivo (reserva inexistente sigue respondiendo «sin reserva <sala> <día>» aunque falte el motivo) — la spec solo fija el caso con reserva y deja intacto el test «sin reserva Sur mar» — si me equivoco, el dev-lead cambia un orden de dos líneas en `cancelBooking`.
Ruling: `anular` (voidBooking) no se toca — «No entra: anulaciones» (0011) — coste si falla: ninguno.
