# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md
Pre-flight: una sola task; sin pares de tasks que compartan fichero; el texto de Task 1 es coherente (tests ya escritos, ficheros: store.js crear, app.js, persist.test.js).
Task 1: Ruling: trabajo en el checkout de la rama feature/0036 (no es main ni worktree enlazado) — la rama ya está aislada — coste si falla: ninguno, nada fuera de la rama
Task 1: Ruling: save se llama en el punto de entrada de la CLI tras cancelar, no dentro de run/cancelBooking — así test/cancel.test.js (que llama run('cancelar') en el cwd del repo) no escribe data/bookings.json y el gate sigue siendo idempotente; cumple la spec (guarda al cancelar) — coste si falla: un llamador que use run() como librería no persiste
Task 1: complete (commits bc936c2..4c65767, tests: node --test test/persist.test.js → ℹ duration_ms 250.7961)
Final review: self-review (no subagent tool)
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: módulo nuevo src/store.js, dato nuevo data/bookings.json (sin dependencias nuevas ni contrato entre módulos) → pasada propia
Final: Ruling: Eje Arquitectura revisado por mí, no por un revisor — store.js es un módulo interno de dos funciones que la decisión 1 de la spec aprobó y architecture.md no lo contradice (el «único fichero de entrada» sigue siendo app.js) — coste si falla: un hallazgo de arquitectura sin ver
Final: minor (deferred): load lanza un SyntaxError crudo si data/bookings.json está corrupto
Final: minor (deferred): cancelar sin reserva activa también reescribe el fichero (inocuo)
