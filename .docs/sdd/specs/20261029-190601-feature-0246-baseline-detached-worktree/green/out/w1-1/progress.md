# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree wt (rama feature/0010-cancel-reason) · env:setup activo · baseline `node --test` en worktree detached → 4/4 verde · sdd-tdd cargado · decálogo leído.
Effort: el harness no expone un agente `sdd-kit:effort-*` (ni tool de subagentes) → Native, revisión final sin subagente disponible. Ruling: efecto de revisión final pendiente — la hará sdd-verify con lo que haya; si no hay subagentes, se dice antes de despachar — coste si falla: la revisión final no tiene contexto fresco.

## Pre-flight scan

| Par / task | Qué produce vs consume | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 (`src/app.js`) | T1 añade `reason` a la reserva cancelada y el motivo válido; T2 lista `status==='cancelled'` con `day` y `reason` | Coherente: T2 consume `reason` y `day` (ya existe en la reserva). |
| T1 ↔ T2 (`test/cancel.test.js`) | ambas añaden tests al mismo fichero | Sin conflicto; T2 añade, no reescribe. |
| T1 interna | el test existente `cancelar una reserva activa` espera `cancelada Norte lun` sin motivo; la spec exige «motivo no válido…» sin `--motivo` | Choca con la spec. |
| T2 interna | `canceladas` sale de `run`, no de cancelBooking; el estado `voided` (anular, feature 0011) no debe listarse | Coherente: solo `cancelled`. |

Rulings del pre-flight:
- Pre-flight: el test existente `cancelar una reserva activa` (sin `--motivo`) contradice el THEN «sin --motivo responde motivo no válido» — Ruling: Task 1 lo actualiza para pasar `--motivo` (la spec manda) y añade el test del rechazo sin motivo — coste si falla: una aserción reescrita en un test que ya existía.
- Pre-flight: el plan no trae pasos ni `Expected:`; los THEN de la spec son el contrato — Ruling: los tests RED salen de los THEN de la spec — coste si falla: algún caso no cubierto por el plan.
- Pre-flight: `--motivo "sala ocupada"` llega a `run` como un único param (el shell ya junta las comillas); `run` lo lee tras `--motivo` — Ruling: parseo mínimo en `run`, función aparte — coste si falla: un refactor de parseo.
