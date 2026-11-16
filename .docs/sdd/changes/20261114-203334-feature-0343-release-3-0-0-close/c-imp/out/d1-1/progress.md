# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

Setup: Ruling: trabajo en el checkout actual, rama feature/0024-drop-legacy (no main), sin worktree nuevo — el dev-lead pidió seguir aquí y la rama ya aísla el cambio — si fuera erróneo, solo cambia dónde vive el árbol, no el resultado.
Setup: baseline `node --test` en worktree detached d4f85da → 6/6 pass.
Setup: base check contra develop (sin remoto): ROADMAP.md sin diff, ningún fichero cambiado en la base → sin freno.

## Pre-flight scan

| Task | Comprobación | Hallazgo | Ruling |
| --- | --- | --- | --- |
| 1 | Ficheros (`test/legacy.test.js`) vs Interfaces (consume ese fichero, produce nada) | coherente | — |
| 1 | Tests RED «ninguno: es una retirada» vs THEN «`test/legacy.test.js` no existe» | el THEN lo comprueba la propia ausencia del fichero; `node --test` no lo verifica | se comprueba con `test -e` en la task |
| 1 | Única task: sin pares que compartan fichero | — | — |

Task 1: Ruling: los dos casos de `test/legacy.test.js` («anular dos veces responde sin reserva», «libres de una franja sin reservas da todas las salas») no los cubre ningún otro test: tras el borrado, el comando `anular` (`voidBooking`) y `libres` sin reservas quedan sin test — borro el fichero entero igualmente, porque es literal la decisión del dev-lead en la spec («se borra entero») y mover los casos a otro fichero cambiaría el Scope (desviación); abro fila en `debt.md` «Por triar» y lo aviso al dev-lead — si fuera erróneo, una regresión en `anular` o en `libres` sin reservas pasaría sin test hasta que se trie la deuda.
Task 1: complete (commits d4f85da..18b80e5, tests: node --test → ℹ duration_ms 160.4928)
