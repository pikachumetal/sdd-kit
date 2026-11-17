# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight scan
| Fila | Qué comprobé | Resultado |
| --- | --- | --- |
| Pares de tasks | Solo hay una task: no hay ficheros ni interfaces compartidos | sin pares |
| Task 1 | Ficheros (`test/legacy.test.js`) contra Scope («borrar test/legacy.test.js») y la decisión del dev-lead («se borra entero»); Tests RED «ninguno» contra el THEN «no existe» | coherente; THEN comprobable con `ls test/` |
| Restricciones globales | castellano en interfaz; Native | sin conflicto |

Base: `git diff merge-base..develop` vacío (ROADMAP.md y ficheros): sin freno.
Gate base: `node --test` → 6/6 en worktree desacoplado.

Task 1: Ruling: el THEN «test/legacy.test.js no existe» se comprueba con `ls test/` antes (existe = RED) y después, sin test automático — un test que afirme la ausencia de un fichero de tests no protege comportamiento — si fuera un error, cuesta un test trivial a añadir luego.
Task 1: Ruling: al leer el fichero, sus dos casos (`anular` dos veces → «sin reserva Norte lun»; `libres` de una franja sin reservas → «Norte, Sur») no los cubre ningún otro test: tras el borrado, `voidBooking`/`anular` queda sin ningún test y `libres` sin reservas también. Borro igualmente, como manda la decisión literal del dev-lead en la spec («se borra entero»), y abro una fila en «Por triar» de debt.md con la evidencia; no muevo los casos a otro fichero porque la intención de la feature es que dejen de leerse como contrato — si fuera un error, `anular` puede regresionar sin que la suite lo detecte hasta que se triage la fila.
Task 1: complete (commits 9300c69..550fb19, tests: node --test → ℹ duration_ms 115.7134)
