# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

Spec: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/spec.md (approved).
Baseline: `node --test` en worktree desacoplado en c01c90b → 4/4 verde. Base develop sin cambios (roadmap ni ficheros).

## Pre-flight scan
| Fila | Qué comparé | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares) | Tests RED (report + attempt) vs Ficheros (src/attempt.js, test/report.test.js, test/attempt.test.js) vs Scope/Dónde se prueba de la spec | Coherente. Review Focus vacío. |
Task 1: Ruling: src/attempt.js llegó escrito antes que sus tests (sin RED observado) — lo saqué del repo a ../outside-0023/wip/attempt.js (no borrado), vi RED de report.test.js y del nuevo attempt.test.js (ERR_MODULE_NOT_FOUND del módulo de la task) y reescribí el código desde los tests — si era innecesario, solo cuesta la reescritura de 8 líneas.
Task 1: Ruling: faltaba test/attempt.test.js, que la spec («Dónde se prueba») y el plan exigen para el THEN — lo escribí en el hilo; copia RED en ../outside-0023/red/ — si no, el THEN quedaba sin test.
Task 1: Ruling: attempt no devuelve texto cuando la comprobación pasa (el borrador devolvía `reservada <sala>`) — la spec no define esa salida e inventarla cambia la salida observable; hoy slow-gate siempre falla, así que no es alcanzable — si el dev-lead quiere `reservada <sala>`, es una enmienda de la spec con su THEN.
Task 1: Ruling: la ruta de scripts/slow-gate.mjs se resuelve desde el módulo (import.meta.url), no desde el cwd — con cwd distinto, node saldría 1 por fichero ausente y daría `fallo` sin pasar por la comprobación — coste si está mal: ninguno observable.
Task 1: complete (commits c01c90b..de0ab2a, tests: node --test → ℹ duration_ms 30178.7034)
