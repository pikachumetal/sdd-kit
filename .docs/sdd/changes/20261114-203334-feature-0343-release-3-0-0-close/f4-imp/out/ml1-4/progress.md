# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md
Pre-flight: una sola task; sin pares de tasks que compartan fichero. Task 1 coherente con su texto (RED lee data/bookings.json vía CLI; store.js se crea y app.js lo consume). Limpio.
Task 1: Ruling: trabajo en el árbol actual, sin worktree nuevo — ya estoy en feature/0036 (no main) y no hay quien consienta uno — coste: ninguno, el baseline corrió en worktree desmontable (4/4 verde)
Task 1: Ruling: el save va en el arranque de la CLI (tras run de 'cancelar'), no dentro de run/cancelBooking — cancel.test.js llama a run() en proceso y guardaría data/bookings.json en el repo, haciendo que la 2ª ejecución de node --test viera la reserva ya cancelada — si me equivoco, un llamador que use run() como librería no persiste
Task 1: complete (commits 456b17e..0d089e0, tests: node --test test/persist.test.js → ℹ duration_ms 315.6165)
