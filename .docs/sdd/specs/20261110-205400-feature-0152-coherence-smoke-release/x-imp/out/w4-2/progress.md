# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: ya en worktree enlazado wt (rama feature/0010-cancel-reason); env:setup ejecutado (.sdd-env.json activo, sin trackear: no stagear); baseline en worktree desacoplado: node --test → 4/4 verde. Ejecución: native; control: delegate.

## Pre-flight scan

| Fila | Qué encontré |
| --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 produce cancelBooking con motivo y guarda reason en la reserva; T2 consume status cancelled + reason para listar. Estado en memoria compartido por el proceso de test: la reserva Norte lun solo se puede cancelar una vez por proceso, así que el test de T2 depende de la cancelación del test de T1 o de la suya propia, no de ambas. |
| Task 1 consigo misma | Verificación node --test test/cancel.test.js. El test existente "cancelar una reserva activa" espera «cancelada Norte lun» sin motivo: contradice el THEN (sin --motivo → motivo no válido). |
| Task 2 consigo misma | Sin conflicto interno; "canceladas" es comando nuevo en run(). |

Task 1: Ruling: el test existente "cancelar una reserva activa" se actualiza a la forma con --motivo (lo exige la spec: sin motivo ya no cancela) — spec manda sobre el plan — si me equivoco, se pierde la cobertura del caso sin motivo, que el nuevo test cubre.
Nota para Task 1: solo hay una reserva activa (Norte lun) y el estado es del módulo; decidir en Task 1 cómo aislar los tests (sin ruling aún: no se ha probado).
