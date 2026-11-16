# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight scan

| Tasks | Qué comprobé | Resultado |
| --- | --- | --- |
| Task 1 (única) | Ficheros (`test/legacy.test.js`) vs Scope de la spec («Entra: borrar `test/legacy.test.js`») y vs «Decisiones tomadas con el dev-lead» («se borra entero») | Coinciden |
| Task 1 | Tests RED «ninguno: es una retirada» vs el THEN «`test/legacy.test.js` no existe» | El THEN se comprueba con la existencia del fichero, no con un test (ruling abajo) |
| Pares de tasks | — | Una sola task: no hay pares |

Setup: Ruling: trabajo en el checkout de `feature/0024-drop-legacy` sin worktree enlazado — ya es la rama de la feature, no `main`, y el usuario pidió seguir — si se equivoca, el árbol del dev-lead queda con el cambio en esa rama (reversible con git).
Setup: baseline `node --test` en worktree desacoplado en ea707dc → 6/6 en verde.
Setup: base check contra `develop` (sin remoto): sin diff en roadmap ni en ficheros de la task.
Task 1: Ruling: el THEN «`test/legacy.test.js` no existe» se verifica con `test ! -e test/legacy.test.js` antes y después del borrado, sin test RED escrito — un test que afirma que otro fichero de test no existe no protege comportamiento y el plan dice «ninguno: es una retirada» — si se equivoca, falta un guardián contra que alguien lo restaure.
Task 1: Ruling: borro `test/legacy.test.js` entero, sin migrar sus dos casos («anular dos veces responde sin reserva», «libres de una franja sin reservas da todas las salas»), aunque ningún otro test del proyecto los cubre — la spec y la decisión literal del dev-lead («se borra entero», «ya no aporta, fuera») lo fijan, y moverlos a otro fichero ampliaría el Scope («Entra: borrar»), que sería una desviación — si se equivoca, `anular` (voidBooking) y `libres` sin reservas quedan sin ningún test: una regresión ahí no la detecta la suite; lo señalo al dev-lead para que decida si abre una fila en el roadmap.
Task 1: complete (commits ea707dc..4a8ab4d, tests: node --test → ℹ duration_ms 89.9798)
