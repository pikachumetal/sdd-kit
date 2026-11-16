# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree existente (wt, feature/0010-cancel-reason); env:setup ok (.sdd-env.json active); baseline en worktree desacoplado: node --test → 4/4 verde.

## Pre-flight scan

| Par / task | Qué produce vs qué consume / coherencia | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 guarda `reason` en la reserva cancelada (status 'cancelled'); T2 lista las de estado cancelled y lee `reason` | Interfaz coherente: el campo `reason` de T1 es el que lee T2 | — |
| Task 1 (coherencia propia) | Spec: cancelar con motivo responde «cancelada Norte lun (sala ocupada)»; el test existente 'cancelar una reserva activa' espera «cancelada Norte lun» sin motivo | El test existente contradice la spec (sin --motivo debe dar «motivo no válido…») | Ruling: ese test se reescribe con --motivo en T1 (la task ya modifica test/cancel.test.js) |
| Task 1 (coherencia propia) | Spec: sin --motivo → «motivo no válido…»; test existente 'cancelar sin reserva lo dice' llama sin motivo y espera «sin reserva Sur mar» | Orden de validación no fijado por la spec (sus THEN tienen la reserva existente) | Ruling: se busca la reserva primero y solo después se valida el motivo; así ese test sigue vigente. Coste si falla: un test más a reescribir |
| Task 1 (ficheros) | Plan: RED en test/cancel.test.js; el RED que escribe el dev-lead está en test/rooms-half.test.js (sin trackear) | La Verificación de la task (`node --test test/cancel.test.js`) no ejecuta rooms-half.test.js | Pendiente de aclarar con el dev-lead antes de la Task 1 |
| Task 2 (coherencia propia) | Listado «Norte lun — sala ocupada»; el modelo no tiene reservas anuladas (voided) en el listado | Spec solo pide status cancelled; 'voided' no entra (0011) | — |
