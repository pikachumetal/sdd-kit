# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md
Pre-flight: una sola task; sin pares de tasks que compartan fichero/interfaz; el texto de la Task 1 es coherente (tests, ficheros y verificación). Sin conflictos.
Base: sin diff de ROADMAP ni de ficheros entre merge-base y develop.
Ruling: trabajo en la rama actual sin worktree nuevo — el RED sin commitear vive en este árbol y la rama no es main — coste si me equivoco: ninguno, se puede mover la rama a un worktree.
Task 1: Ruling: test/cancel.test.js corre run() en proceso y con el guardado dejaba data/bookings.json en el repo; la 2ª `node --test` fallaba (libres y cancelar) — lo aíslo con chdir a un directorio temporal antes de importar app.js, sin tocar sus asserts; fichero fuera de la lista del plan — si me equivoco: un test existente cambia de setup, revertible en un commit.
Task 1: RED comparado con la copia: idéntico.
Task 1: complete (commits 0b90161..85482bb, tests: node --test test/persist.test.js → ℹ duration_ms 298.1047)
