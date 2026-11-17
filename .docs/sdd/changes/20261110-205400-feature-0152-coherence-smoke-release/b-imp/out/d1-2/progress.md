# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

Spec: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/spec.md (approved, dev-lead Laura 2026-10-14)
Worktree: in place on feature/0024-drop-legacy (normal checkout, not main). Baseline `node --test` in detached worktree → 6/6 pass.
Effort: Native, no dispatch before the final review.

## Pre-flight scan

| Ámbito | Qué produce / consume | Hallazgo |
| --- | --- | --- |
| Pares de tasks | una sola task: no hay pares | — |
| Task 1 | Consume `test/legacy.test.js`, Produce nada; Ficheros = `test/legacy.test.js`; Tests RED «ninguno: es una retirada»; Verificación `node --test` | coherente consigo misma; el THEN de la spec («test/legacy.test.js no existe») no lleva test RED → ruling 1 |
| Task 1 vs spec | Scope «Entra: borrar test/legacy.test.js»; «No entra: cambiar src/app.js»; decisión del dev-lead «se borra entero» | los 2 casos del fichero (anular dos veces; libres de franja sin reservas) no los cubre ningún otro test (grep de `anular` y `08:00` en test/) → ruling 2 |

Task 1: Ruling: el THEN «test/legacy.test.js no existe» se comprueba con `test ! -e test/legacy.test.js` antes y después del borrado, sin test committeado — el plan fija «Tests RED: ninguno: es una retirada» y un test que vigila la ausencia de un fichero de test sería otro test heredado — si es erróneo: falta un guard automático y el fichero podría volver sin que nada falle.
Task 1: Ruling: borro `test/legacy.test.js` entero aunque sus dos casos («anular dos veces responde sin reserva», «libres de una franja sin reservas da todas las salas») no tienen cobertura en otro test — es literal la decisión del dev-lead en la spec («se borra entero») y el Scope; mover los casos a otro fichero cambiaría el Scope (desviación) y no cambia la salida observable — si es erróneo: `voidBooking`/`anular` queda sin ningún test y la rama de `libres` sin reservas sin regresión; se recupera con un patch que los reescriba en `test/cancel.test.js`/`test/app.test.js`.
Task 1: complete (commits 103f20c..9f9c6dc, tests: node --test → ℹ duration_ms 111.2064)
