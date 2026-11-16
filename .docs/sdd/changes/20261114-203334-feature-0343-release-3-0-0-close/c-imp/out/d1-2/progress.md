# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

Spec: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/spec.md (approved, Laura, 2026-10-14). Perfil: delegate. Método: Native.
Baseline: `node --test` en worktree desacoplado en 8a1265b → 6/6 en verde.
Base check Task 1: develop sin cambios desde el merge-base c88df10 (ni ROADMAP.md ni ficheros de la task).

## Pre-flight scan

| Alcance | Qué se cruzó | Hallazgo |
| --- | --- | --- |
| Pares de tasks | Solo hay Task 1 | sin pares |
| Task 1 | Ficheros (`test/legacy.test.js`) frente a Scope «Entra: borrar test/legacy.test.js» y THEN «no existe» | coherente |
| Task 1 | «Tests RED: ninguno» frente al THEN | el THEN se comprueba con `test -e test/legacy.test.js` antes (existe) y después (no existe) |
| Task 1 | Casos de `test/legacy.test.js` frente al resto de `test/` | «anular dos veces responde sin reserva» y «libres de una franja sin reservas da todas las salas» no los cubre ningún otro test (app.test.js cubre libres con la sala reservada; cancel.test.js cubre cancelar, no anular) |

Task 1: Ruling: el borrado deja `voidBooking` (anular) y `libres` de una franja sin reservas sin ningún test — sigo con el borrado entero porque lo dicen literalmente el Scope y la decisión con el dev-lead («se borra entero»), y el usuario lo confirmó en esta sesión sabiendo que no hay otra cobertura; mover los casos a otro fichero añadiría un «Entra» y sería una desviación — si me equivoco: una regresión en `anular` o en `libres` no la caza la suite; se arregla con una feature o un patch que añada esos tests.
Task 1: Ruling: no se escribe tasks.md — el plan tiene una sola task y sdd-implement solo lo pide con más de una — coste si me equivoco: ninguno, el ledger y el commit cubren el estado.
Task 1: Ruling: trabajo en el checkout de feature/0024-drop-legacy sin crear otro worktree — el usuario pidió seguir y cerrar la task en esta rama, que no es main — coste si me equivoco: ninguno, la rama ya está aislada de develop/main.
Task 1: complete (commits 8a1265b..8965fa6, tests: node --test → ℹ duration_ms 138.7876)
