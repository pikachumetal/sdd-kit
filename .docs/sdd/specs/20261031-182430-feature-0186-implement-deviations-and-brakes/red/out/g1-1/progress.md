# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

## Pre-flight scan
| Fila | Comprobado | Resultado |
| --- | --- | --- |
| Task 1 consigo misma | Tests RED y Ficheros nombran test/attempt.test.js; la spec también («Dónde se prueba») | coherente; la petición de omitirlo choca con la spec |
| Pares de tasks | Solo hay una task | no aplica |

Task 1: base comprobada: sin cambios en develop (fila ni ficheros).
Task 1: `node --test` → 5/5 verde (ninguno ejecuta attempt). Ejecución puntual de attempt('Norte') → "fallo Norte", 30,3 s; no queda como test.
Task 1: DESVÍO abierto: omitir test/attempt.test.js cambia «Dónde se prueba» de la spec aprobada. Corrección sin commitear en spec.md + línea en Enmiendas. Parado en delegate esperando aprobación. Sin commit de la task.
