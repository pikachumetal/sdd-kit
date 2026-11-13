# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

Setup: rama feature/0024-drop-legacy en el checkout principal (no main); baseline `node --test` en worktree detached → 6/6 verde. Base check: develop sin cambios desde el merge-base (ROADMAP.md ni ficheros de la task).

## Pre-flight scan

| Task | Comprobado | Hallazgo |
| --- | --- | --- |
| 1 | Tests RED «ninguno: es una retirada» vs THEN «legacy.test.js no existe»; Ficheros = el que consume; sin pares (una sola task) | coherente |

Task 1: Ruling: sin tests RED — la task solo borra un fichero de tests, no hay código de producción; el THEN se comprueba listando test/ — si es erróneo, nada lo cubre salvo la revisión.
Task 1: Ruling: borro test/legacy.test.js entero aunque sus dos casos («anular dos veces responde sin reserva» y «libres de una franja sin reservas da todas las salas») no los cubre ningún otro test — lo fija «Decisiones tomadas con el dev-lead» de la spec y el dev-lead confirmó en el hilo que siga; mover los casos a otro fichero cambiaría el Scope — si es erróneo, una regresión en voidBooking repetido o en freeRooms sin reservas no la detecta la suite.
Task 1: complete (commits 7566af2..cdab0fc, tests: node --test → ℹ duration_ms 159.0044)
