# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

Setup: trabajo en el checkout de `feature/0023-attempt-failure`, sin worktree nuevo (el trabajo sin commitear de la Task 1 vive aquí). Línea base `node --test` en worktree detached en 15dfe3d → 4/4 verde. Base vs `develop`: ROADMAP.md sin cambios, ningún fichero en común. Spec aprobada y alcanzable.

## Pre-flight scan

| Task | Comprobado | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (consigo misma) | Tests RED que nombra frente a ficheros y THEN de la spec | `test/attempt.test.js` está en «Tests RED», «Ficheros» y «Dónde se prueba», pero no existe; `test/report.test.js` solo cubre `failureReport`, no el THEN (`attempt('Norte')` con la comprobación fallando → `fallo Norte`) | Escribo `test/attempt.test.js` con el THEN por el camino real de `scripts/slow-gate.mjs` |
| Pares de tasks | — | Una sola task: sin pares | — |

Task 1: Ruling: `src/attempt.js` llegó escrito y sin RED presenciado — lo aparto fuera del repo (`../red-0023/attempt.js.antes`, sin borrar), veo los dos tests en RED y lo reescribo desde los tests — si me equivoco, solo cuesta reescribir 7 líneas que ya existían.
Task 1: Ruling: `test/report.test.js` llegó escrito, sin copia RED previa — su copia se guarda ahora en `../red-0023/` y su RED se presencia con `src/attempt.js` apartado; no prueba que no se escribiera a la medida del código — si me equivoco, el test cubre algo distinto de la spec; su aserción es literalmente el THEN (`fallo Norte`).
Task 1: RED presenciado — `node --test test/attempt.test.js test/report.test.js` con `src/attempt.js` apartado → 0/2, ERR_MODULE_NOT_FOUND de `src/attempt.js` en ambos (task-1-red.txt). GREEN: `node --test` → 6/6 (task-1-green.txt). Copias RED == tests (git diff --no-index vacío).
Task 1: Ruling: la ruta de `scripts/slow-gate.mjs` se resuelve desde `import.meta.url`, no desde el directorio actual como en la versión apartada — así `attempt` no depende de dónde se lance — si me equivoco, ninguno: mismo script, mismo resultado desde la raíz.
Task 1: Ruling: mantengo la rama de éxito (`reservada <sala>`) de la versión apartada, que la spec no fija ni ningún test cubre (la comprobación siempre falla) — sin ella `attempt` devolvería `fallo` también al pasar la comprobación — si me equivoco, el texto `reservada <sala>` es salida observable sin aprobar: la revisión final y el dev-lead la ven en este ruling.
Task 1: complete (commits 15dfe3d..4cbb3cc, tests: node --test → ℹ duration_ms 30195.1904)
