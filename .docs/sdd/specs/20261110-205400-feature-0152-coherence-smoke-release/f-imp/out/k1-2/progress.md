# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

Setup: checkout normal en feature/0018-help (no main); línea base 5/5 verde con `node --test`. Base check contra develop: sin diff. Spec aprobada.

## Pre-flight scan
| Par/Task | Qué produce / consume | Hallazgo |
| --- | --- | --- |
| Task 1 (única) vs su texto | tests `test/ayuda.test.js` y `src/app.js` coherentes | OK |
| Task 1 vs `test/readme.test.js` | Task 1 añade `ayuda` a `handlers`; el plan dice que `commands` sigue siendo `Object.keys(handlers)`; readme.test compara `commands` con las viñetas del README, y README no entra (feature 0020) | CHOQUE: añadir `ayuda` a handlers deja readme.test en rojo |
Task 1: Ruling: `commands` pasa de `Object.keys(handlers)` a `Object.keys(descriptions)` (tabla de frases de los 4 comandos, sin `ayuda`) — añadir `ayuda` a handlers dejaba readme.test en rojo y el README no entra (0020); la spec no fija `commands` — si me equivoco: `ayuda` no se comprueba contra el README hasta que la 0020 lo documente y la incluya en `commands`.
Task 1: Ruling: la ayuda lista los 4 comandos que la spec nombra, sin su propia línea `ayuda` — el THEN enumera esos cuatro — si me equivoco: falta una línea `ayuda: …`, un cambio de una línea.
Task 1: complete (commits 6d77a7a..aeb7982, tests: node --test → ℹ duration_ms 151.9305)
