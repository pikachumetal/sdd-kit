# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight scan
| Tarea(s) | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1 | Tests RED «ninguno: es una retirada» frente al THEN «legacy.test.js no existe»; Ficheros = solo test/legacy.test.js; Verificación node --test | Coherente. Pares de tasks: no hay (una sola task). |

Task 1: Ruling: worktree — trabajo en el checkout actual de feature/0024-drop-legacy, ya aislado de develop/main y limpio; baseline node --test 6/6 en verde — si hiciera falta un worktree aparte, coste nulo: no hay más trabajo en paralelo.
Task 1: Ruling: pérdida de cobertura aceptada — los dos casos de test/legacy.test.js (anular dos veces → «sin reserva»; libres de franja sin reservas → todas las salas) no los cubre ningún otro test; el spec manda borrar el fichero entero por decisión literal del dev-lead («ese fichero ya no aporta, fuera») y su Intent es precisamente que dejen de leerse como contrato, así que no los traslado a otro fichero (eso sería cambiar el Scope) y el dev-lead lo confirmó en esta sesión con «sigue y cierra la task» — si fuera un error, voidBooking y la rama de libres sin reservas quedan sin red de tests: una regresión ahí no la vería node --test; se corrige con un patch que añada esos dos casos a test/app.test.js.
Task 1: Ruling: RED — el plan declara «Tests RED: ninguno: es una retirada»; el THEN (el fichero no existe) se comprueba con ls tras el borrado, sin test nuevo — coste si es error: ninguno funcional.
Task 1: complete (commits 098f24c..376a5e6, tests: node --test → ℹ duration_ms 187.5261)
