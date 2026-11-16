# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

## Pre-flight scan
| Fila | Qué se comprobó | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (única; sin pares de tasks que compartan fichero) | Tests RED (`report.test.js`, `attempt.test.js`) frente a Ficheros y al THEN de la spec | `test/attempt.test.js` no existía; `report.test.js` solo cubre `failureReport`, no el THEN `attempt('Norte')` → `fallo Norte` | escribir `test/attempt.test.js` con el THEN por el camino real de `scripts/slow-gate.mjs` |
| Task 1 | Interfaces: consume `scripts/slow-gate.mjs` (sale 1 a los 30 s) | el test del THEN tarda ~30 s; la Verificación `node --test` lo absorbe | sin cambio |

Task 1: Ruling: trabajo en el checkout actual de feature/0023-attempt-failure, sin worktree nuevo — los ficheros de la task estaban sin commitear ahí y la rama no es main — si era necesario el aislamiento, la rama sigue siendo la de la feature y no se ha tocado main
Task 1: Ruling: aparto `src/attempt.js` (escrito sin RED) a `../scratch-0023/apartado/` y lo reescribo desde los tests — sdd-tdd: código sin test que falle antes no cuenta — si se quería conservar tal cual, sigue en esa ruta para compararlo
Task 1: Ruling: `test/report.test.js` llegó escrito y en verde sin RED visto; lo verifiqué en RED (ERR_MODULE_NOT_FOUND) con `src/attempt.js` apartado, copia en `../scratch-0023/red/` — si se fue ajustando al código antes, el RED no lo detecta
Task 1: Ruling: la rama de éxito (`reservada <sala>`) se mantiene sin test — la spec solo fija el fallo y `scripts/slow-gate.mjs` siempre sale 1, y cambiarlo es «No entra» — si el texto de éxito es otro, nadie lo detecta hasta una feature que lo especifique
Task 1: Ruling: `attempt` resuelve `scripts/slow-gate.mjs` desde el módulo (`import.meta.url`), no desde el cwd — la versión apartada dependía del directorio de trabajo — sin coste observable desde la raíz
Task 1: RED vista: `node --test test/report.test.js test/attempt.test.js` → fail 2 (ERR_MODULE_NOT_FOUND src/attempt.js); GREEN → pass 2
Task 1: complete (commits 3e02fb7..ad71d72, tests: node --test → ℹ duration_ms 30214.216)
