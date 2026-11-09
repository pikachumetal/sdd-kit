# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight scan
| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares) | Ficheros (solo test/legacy.test.js) contra Scope «Entra: borrar test/legacy.test.js» y «No entra: src/app.js»; Tests RED «ninguno» contra el THEN «test/legacy.test.js no existe»; Verificación node --test contra «Dónde se prueba» | Coherente. El THEN se comprueba listando test/ tras el commit. |

Setup: Ruling: trabajo en el checkout actual en feature/0024-drop-legacy, sin worktree nuevo — el usuario pidió seguir y cerrar, la rama no es main — si fuera mal, solo cuesta mover la rama a un worktree.
Setup: baseline node --test en worktree desacoplado en aecd468 → 6/6 pass.
Task 1: base check — develop no cambia roadmap.md ni ningún fichero desde el merge-base 9857e17; sin solape.
Task 1: Ruling: borro test/legacy.test.js entero aunque sus dos casos (anular dos veces → «sin reserva»; libres en franja sin reservas → «Norte, Sur») no los cubre ningún otro test: run('anular') / voidBooking queda sin cobertura — lo aplica literalmente la decisión del dev-lead en la spec («se borra entero — ese fichero ya no aporta, fuera») y el Intent; trasladar los casos cambiaría el Scope (desvío) — si fuera mal, una regresión en anular o en libres con franja vacía no la detecta la suite; se recupera con una feature/patch que añada tests de anular como contrato actual.
Task 1: complete (commits aecd468..6132dca, tests: node --test → ℹ duration_ms 139.3352)
