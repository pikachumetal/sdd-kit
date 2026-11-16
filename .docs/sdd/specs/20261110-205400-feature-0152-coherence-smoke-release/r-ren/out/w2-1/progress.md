# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Baseline: `node --test` en worktree detached de HEAD (b04080c) → 4 tests, 4 pass, 0 fail.

## Pre-flight scan

| Par / task | Qué produce → qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 guarda el motivo en la reserva con status cancelled; T2 lista las reservas cancelled con su motivo | Coherentes. T2 depende del campo del motivo que fija T1. |
| Task 1 (consigo misma) | Los tests de cancel.test.js hoy esperan «cancelada Norte lun» y «sin reserva Sur mar» sin --motivo; la spec dice que sin --motivo responde «motivo no válido…» | Esos dos tests existentes cambian de contrato: se actualizan en el RED de T1. |
| Task 2 (consigo misma) | `canceladas` lista status cancelled; `anular` (voidBooking) pone voided | Solo cancelled, nunca voided (anulaciones = 0011, No entra). |

Ruling: sin --motivo y sin reserva a la vez — la spec no fija el orden — valido el motivo primero (la spec pide «motivo no válido» sin condiciones) — si se quería «sin reserva» primero, cambia un orden de dos mensajes.
Ruling: test/rooms-half.test.js sin trackear es el RED de la Task 1 del dev-lead — no lo toco ni lo commiteo yo hasta que lo dé por bueno — si no cubre el motivo, la Task 1 queda sin su RED.
