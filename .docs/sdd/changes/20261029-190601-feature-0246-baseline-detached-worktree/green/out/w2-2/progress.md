# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree existente (wt, feature/0010-cancel-reason); env:setup ok; baseline en worktree desacoplado: node --test → 4/4 pass. sdd-tdd cargada; decálogo leído. Método: Native (plan: native). Effort: sin despachos hasta la revisión final.
Nota: test/rooms-half.test.js (sin versionar) es el RED de la Task 1 que escribe el dev-lead; no se toca.

## Pre-flight scan

| Fila | Qué | Hallazgo | Ruling |
| --- | --- | --- | --- |
| T1↔T2 | comparten src/app.js y test/cancel.test.js; T1 produce el motivo guardado en la reserva cancelada, T2 lo consume en `canceladas` | sin conflicto: T2 lee `booking.reason` que T1 fija; nombre del campo no lo fija el plan | Ruling: campo `reason` — lo fija T1, T2 lo lee — si falla, un renombrado |
| T1 consigo | el plan no trae pasos ni Expected; sus tests salen de los THEN de la spec | coherente con la spec | — |
| T1 vs test existente | `cancelar una reserva activa` espera «cancelada Norte lun» sin motivo; la spec pide error sin `--motivo` | contradice la spec | Ruling: ese test se actualiza en T1 al THEN de la spec (con `--motivo`) — la spec manda — coste si falla: reescribir un test |
| T1 vs test existente | `cancelar sin reserva` (Sur mar, sin motivo) espera «sin reserva Sur mar»; la spec no dice qué va antes | ambigüedad | Ruling: se comprueba primero la reserva, luego el motivo — mantiene verde el test y la spec no lo impide — coste: una inversión de orden |
| T2 consigo | `canceladas` lista status cancelled; `voidBooking` deja 'voided' | no se mezclan | — |
| T1/T2 vs fichero fuera | test/rooms-half.test.js no está en «Ficheros» del plan | es el RED del dev-lead; entra en el commit de T1 | Ruling: lo cometo con T1 sin modificarlo — coste: ninguno |
| Spec | «Decisiones» numeradas 1 y 3 (falta el 2) | cosmético | — |
