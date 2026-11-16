# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight scan

| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (coherencia interna) | Tests RED «ninguno: es una retirada» frente a Ficheros `test/legacy.test.js` y THEN «legacy.test.js no existe» | Coherente: la única superficie es borrar el fichero; sin pares de tasks (una sola) |

Setup: checkout normal en feature/0024-drop-legacy (no main), sin worktree aparte; baseline `node --test` en worktree desprendido → 6/6 verde.
Task 1: Ruling: trabajo en el checkout de la rama feature, sin crear worktree — la rama ya aísla de main/develop y el perfil es delegate — si se quería worktree, solo cambia el directorio, no el resultado.
Task 1: Ruling: sin test RED — el plan dice «ninguno: es una retirada» y un test que afirme la ausencia de un fichero de test no protege comportamiento; el THEN se comprueba con `test ! -e test/legacy.test.js` — si se quería un test, se añade sin tocar código.
Task 1: Ruling: borro `test/legacy.test.js` entero aunque sus dos casos («anular dos veces responde sin reserva», «libres de una franja sin reservas da todas las salas») no los cubre ningún otro test — es la decisión literal del dev-lead en el spec («se borra entero — ese fichero ya no aporta, fuera»); reubicarlos los mantendría como contrato, contra el Intent — si el dev-lead sí quería conservar esa cobertura, `voidBooking` (anular) y `libres` sin reservas quedan sin test: lo dejo en debt.md «Por triar» y en el informe.
Task 1: complete (commits 59f153b..4d6bb96, tests: node --test → ℹ duration_ms 104.8906)
Task 1: Ruling: fila en debt.md «Por triar» por la cobertura perdida, commit 49965ed de 1 línea solo de documentación — revisado en el hilo — si el dev-lead no la quiere, se borra la fila.
