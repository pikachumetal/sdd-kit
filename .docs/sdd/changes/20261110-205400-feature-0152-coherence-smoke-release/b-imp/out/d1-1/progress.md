# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight scan

| Fila | Comprobado | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | Tests RED «ninguno: es una retirada» frente a la spec: el único THEN («`test/legacy.test.js` no existe») se comprueba listando `test/`; Ficheros = `test/legacy.test.js`, el mismo que Consume; Verificación `node --test` = «Dónde se prueba» | Coherente consigo misma |
| Task 1 frente a la spec | Scope «Entra: borrar `test/legacy.test.js`»; «No entra: cambiar `src/app.js`»; decisión del dev-lead: «se borra entero» | Los dos casos del fichero (anular dos veces → `sin reserva`; libres de franja sin reservas → `Norte, Sur`) no los cubre ningún otro test (`app.test.js`, `cancel.test.js`): ver Ruling |

Task 1: Ruling: la retirada deja sin test dos comportamientos vivos de `src/app.js` (`anular` repetido → `sin reserva <sala> <día>`, `voidBooking`; `libres` en una franja sin reservas → todas las salas) que ningún otro test cubre — borro el fichero entero como fija la decisión literal del dev-lead («`test/legacy.test.js` se borra entero») y NO muevo los casos a otro fichero: hacerlo cambiaría el Scope (desviación) y contradiría esa decisión; lo llevo al mensaje final y al walkthrough para que el dev-lead decida si abre un patch/fila que los recupere como contrato — si me equivoco, una regresión en `anular` o en `libres` sin reservas pasa la suite en verde hasta que se reponga la cobertura.
Task 1: Ruling: sin copia RED — la Task 1 declara «Tests RED: ninguno: es una retirada»; el THEN se comprueba con `git ls-files test/` tras el commit — si me equivoco, falta una prueba de que el THEN falló antes, que aquí es trivial (el fichero existe en BASE).
Task 1: complete (commits b530c69..aa35401, tests: node --test → ℹ duration_ms 93.8756)
