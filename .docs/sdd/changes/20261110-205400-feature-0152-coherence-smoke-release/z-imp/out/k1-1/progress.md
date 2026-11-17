# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

## Pre-flight scan
| Par/Task | Qué produce vs consume | Hallazgo |
| --- | --- | --- |
| Task 1 (única, sin pares) | Consume `handlers` y `commands`; produce `ayuda` en `handlers` | El plan manda `ayuda` en `handlers` y `commands = Object.keys(handlers)`; `test/readme.test.js` compara `commands` con el README, que está en «No entra» (feature 0020): `ayuda` en `handlers` lo pondría en rojo |
| Task 1, coherencia interna | Tests: `test/ayuda.test.js`; ficheros: `src/app.js`, `test/ayuda.test.js` | Coincide consigo misma, salvo lo anterior |

Task 1: Ruling: `ayuda` se despacha en `run` fuera de la tabla `handlers`, con las frases en su propia tabla; `commands` sigue siendo `Object.keys(handlers)` y no cambia — la spec manda (README en «No entra», gate `node --test` verde) y el plan lo contradice en «Produce» — si me equivoco, `ayuda` no aparece en `commands` y la 0020 decide si documentarla
Task 1: Ruling: base sin cambios en `develop` ni `main` (sin diff de ROADMAP ni de ficheros) — sigo
Task 1: complete (commits 4334178..fe9d33d, tests: node --test → ℹ duration_ms 157.5619)
Final: Revisión final: self-review (no subagent tool) — pasadas separadas Spec, Código, Arquitectura sobre fe9d33d
Final: Spec: THEN cubierto (una línea `<comando>: <frase>` con libres, reservar, cancelar, anular; verificado por CLI y por test/ayuda.test.js); README, cancelar y demás comandos intactos; `commands` sin cambio; Review Focus: ninguno
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo nuevo, sin dependencia, sin contrato entre módulos, sin datos) → no sale
Final: minor (deferred): `phrases` se indexa por `commands`; un comando nuevo sin frase mostraría `undefined` en la ayuda (src/app.js)
Final: Declined to judge: `ayuda` no se lista a sí misma — la spec nombra los cuatro comandos y el README tampoco la documenta (0020); si se quiere, es decisión de la 0020
