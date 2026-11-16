# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

## Pre-flight
| Fila | Comprobado | Resultado |
| --- | --- | --- |
| Task 1 consigo misma | Tests RED y Ficheros nombran report.test.js y attempt.test.js; coinciden con «Dónde se prueba» | limpio |

Task 1: base d86e9f9; roadmap y ficheros de develop sin cambios respecto a la rama
Task 1: Desviación pendiente: retirar test/attempt.test.js de «Dónde se prueba» — propuesta sin commitear en spec.md, esperando aprobación. Sin commit de la task.
Task 1: Evidencia: node --test → 5/5 (sin attempt.test.js); attempt('Norte') a mano → "fallo Norte", 30,3 s
