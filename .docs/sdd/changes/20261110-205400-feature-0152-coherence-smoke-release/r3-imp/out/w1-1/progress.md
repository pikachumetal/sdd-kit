# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree enlazado `wt` en feature/0010-cancel-reason (no se crea otro). env:setup corrido (data/ + .sdd-env.json, este sin versionar: no entra en ningún commit). Línea base en worktree desacoplado: `node --test` → 4/4 pass. Spec aprobada (Laura, 2026-10-08), plan approved, Ejecución native.

## Pre-flight scan

| Tareas / tarea | Qué produce / consume / dice | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 (comparten `src/app.js` y `test/cancel.test.js`) | T1 deja en la reserva cancelada `status: 'cancelled'` y el campo `reason`; T2 lo lee para listar | Coherente si T2 usa el campo `reason` de T1. Las `voided` no se listan (la spec deja fuera las anulaciones, 0011). |
| T1 (consigo misma) | Pide `--motivo` obligatorio; el test existente `cancelar una reserva activa` espera `cancelada Norte lun` sin motivo | Contradice la spec (sin `--motivo` → «motivo no válido…»). El test está en los ficheros de T1: se actualiza al THEN de la spec. |
| T1 (consigo misma) | `cancelar Sur mar` sin reserva y sin motivo: la spec no dice cuál error gana | La spec solo fija el caso con reserva. |
| T2 (consigo misma) | `canceladas` espera `Norte lun — sala ocupada`; `bookings` es estado de módulo y el test depende del orden dentro de `cancel.test.js` | Riesgo de test acoplado al orden. Se decide al escribir el RED de T2. |
| T2 (consigo misma) | Salida con varias canceladas o ninguna | La spec solo fija una. |

Task 0: Ruling: el test existente `cancelar una reserva activa` se reescribe al THEN de la spec (con `--motivo "sala ocupada"`) y se añade el caso sin motivo — la spec manda — si me equivoco, se pierde un caso de regresión que el RED de T1 ya cubre
Task 0: Ruling: sin reserva y sin `--motivo`, gana `sin reserva …` (se conserva la salida actual, el test existente `cancelar sin reserva lo dice` no cambia) — la spec solo fija el error de motivo con reserva — si Laura prefería el error de motivo primero, es un cambio de una línea y un test
Task 0: Ruling: T2 hará su test independiente del orden (la cancelación entra dentro del propio test o se comprueba contra el estado que T1 deja de forma explícita), y con varias canceladas una por línea; sin canceladas, cadena vacía — la spec no dice más — si Laura quería otro texto, se enmienda en la spec
Task 0: Ruling: tipos `sdd-kit:effort-<level>`: no veo en esta sesión una herramienta de subagentes ni esos tipos; la revisión final (ejes de `sdd-verify`) los necesitará — efecto: se dispara heredando el de la sesión y se anota; si el harness sigue sin subagentes, la revisión final se queda en un stop a decidir con el dev-lead
