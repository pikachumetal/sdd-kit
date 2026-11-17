# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

## Pre-flight
| Fila | Comprobado | Hallazgo |
| --- | --- | --- |
| Task 1 (consigo misma) | Tests RED y Ficheros contra Interfaces | coherente; una sola task, sin pares |

Task 1: base check — develop sin cambios desde la merge-base; BASE bfee401
Task 1: evidencia — node --test 5/5 verde (sin test/attempt.test.js); attempt('Norte') real → "fallo Norte" en 30,5 s
Task 1: PARADA por desviación — el usuario pide no escribir test/attempt.test.js; la spec lo fija en «Dónde se prueba». Enmienda sin commitear en spec.md, pendiente de aprobación. Task abierta, sin commit.
