# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight scan

| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (coherencia interna) | Tests RED «ninguno: es una retirada» frente a Ficheros `test/legacy.test.js` y el THEN «`test/legacy.test.js` no existe» | Coherente: el THEN se comprueba listando `test/`, no hace falta test nuevo |
| Pares de tasks | Solo hay una task | Sin pares |
| Base | `git diff <merge-base> develop`: sin cambios en roadmap ni en ficheros | Sin freno |

Task 1: Ruling: los dos casos de `test/legacy.test.js` (anular dos veces → «sin reserva»; `libres` de una franja sin reservas → «Norte, Sur») no los cubre ningún otro test, y `anular`/`voidBooking` se queda sin ningún test — borro el fichero entero tal como manda la decisión con el dev-lead («ese fichero ya no aporta, fuera»); mover los casos a otro fichero cambiaría el Scope (desvío) y no es mío — si es un error, una regresión en `anular` o en `libres` sin reservas pasa la suite sin avisar; se arregla con un patch que añada esos dos tests.
Task 1: complete (commits 0699365..70cf59d, tests: node --test → ℹ duration_ms 462.0285)
