# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Setup: worktree enlazado en feature/0010-cancel-reason; env:setup hecho (.sdd-env.json active); baseline `node --test` en worktree detached → 4/4 verde; sdd-tdd cargado; decalogo leido.
Setup: Ruling: sin herramienta de subagentes en este harness, no se puede comprobar `sdd-kit:effort-*` — efecto: la revision final por ejes no puede despacharse aqui — cuesta si me equivoco: revision final por hacer con otra sesion/harness.
Pre-flight (pares que comparten fichero/interfaz):
| Par | Produce / consume | Hallazgo |
| T1 x T2 (src/app.js, test/cancel.test.js) | T1 guarda el motivo en la reserva cancelada; T2 lo lista | El plan no nombra el campo. Ruling: campo `reason` en la reserva; T2 lo lee de ahi. Coste si falla: un renombrado. |
Pre-flight (coherencia por task):
| Task | Hallazgo |
| T1 | test existente `cancelar una reserva activa` (cancel.test.js) espera «cancelada Norte lun» sin motivo; la spec exige «motivo no válido…» sin --motivo. Ruling: se actualiza ese test a la spec en T1 (esta en sus Ficheros). Coste si falla: un test reescrito. |
| T1 | spec no fija el orden de validacion (motivo vs reserva inexistente). Ruling: la reserva se comprueba primero, asi `sin reserva Sur mar` (test existente) no cambia. Coste: un caso de salida no cubierto por la spec. |
| T1 | los RED del dev-lead estan en test/rooms-half.test.js (sin commitear, incompleto: el 2º test esta cortado), pero la Verificación de T1 es `node --test test/cancel.test.js`, que no lo ejecuta. PENDIENTE: lo decide el dev-lead (ruta del RED o Verificación). |
| T2 | coherente: mismo fichero, Verificación sobre cancel.test.js. |
