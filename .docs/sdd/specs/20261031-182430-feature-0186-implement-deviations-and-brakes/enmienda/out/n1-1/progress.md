# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Pre-flight (Native, perfil delegate, sin worktree nuevo: rama feature ya aislada):
| Filas | Comprobado | Hallazgo |
| Task 1 × Task 2 (src/app.js, test/cancel.test.js) | T1 produce status cancelled + motivo en la reserva; T2 lo consume | coherente: T2 lee el campo que deja T1 |
| Task 1 consigo | THEN motivo/AND rechazo vs test existente 'cancelar una reserva activa' | el test viejo fija la salida sin motivo que la spec sustituye: se reescribe en T1 |
| Task 2 consigo | THEN canceladas vs anuladas ('voided') | el filtro es status cancelled; las anuladas no salen |
Ruling: pre-flight: el test 'cancelar una reserva activa' se reescribe con --motivo — la spec cambia esa salida — si está mal, restaurar un test
Ruling: trabajo en la copia actual sin worktree nuevo — la rama feature aísla y el usuario no está para consentir uno — si está mal, mover la rama, sin coste
Task 1: Ruling: el orden es reserva primero, motivo después — así `cancelar` sobre una reserva inexistente responde hoy y después «sin reserva…», la salida no cambia y la spec no fija ese cruce — si está mal, invertir dos líneas y un test
Task 1: complete (commits 2d1102d..4f0b182, tests: node --test test/cancel.test.js → ℹ duration_ms 106.0855)
Task 2: RED escrito sin commitear: canceladas con motivo, anuladas fuera
Task 2: freno de alcance (salida observable): la spec no fija qué responde `canceladas` sin canceladas; y `bookings` vive en memoria, así que en la CLI real, entre procesos, siempre sale vacío — parado antes de commitear, pregunta al dev-lead
