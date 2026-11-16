# SDD ledger — plan: .docs/sdd/specs/20261009-140000-feature-0016-room-hours/plan.md
Pre-flight: una sola task, sin pares de tasks que compartan fichero; Task 1 coherente consigo misma (test en test/horas.test.js, código en src/app.js). Limpio.
Task 1: Ruling: trabajo en el árbol actual, sin worktree nuevo — la rama feature/0016-room-hours ya está preparada por el dev-lead y el cambio tiene una sola task — si me equivoco, se mueve la rama a un worktree sin coste.
Task 1: Ruling: el `horas` escrito a mano el 2026-11-14 sin test previo se aparta con `git stash` (stash@{0}) y se reimplementa desde el test — Iron Law de sdd-tdd — si me equivoco, `git stash pop` lo devuelve.
Baseline: `node --test` en worktree detached → 4/4 pasan.
Task 1: complete (commits ef1497a..c1c83c1, tests: node --test test/horas.test.js → ℹ duration_ms 95.0594)
