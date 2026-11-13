# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

## Pre-flight scan
| Tarea(s) | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1 | Tests RED (report + attempt) contra el THEN de la spec y los ficheros que crea | `test/attempt.test.js` no existía y es el único que cubre el THEN (`attempt('Norte')` → `fallo Norte`); `report.test.js` solo cubre `failureReport`. |
| Task 1 | Interfaz consumida `scripts/slow-gate.mjs` | Siempre sale con 1 a los 30 s: el test de `attempt` tarda ~30 s, sin doble (la spec pide «el camino de la comprobación»). |

Task 1: Ruling: trabajo en el checkout principal, en `feature/0023-attempt-failure`, sin worktree aparte — el dev-lead dejó el trabajo de la task sin commitear aquí y pidió seguir; la baseline corrió en un worktree separado (4/4 en verde) — si estaba mal, el riesgo es tocar el checkout del dev-lead, sin cambios fuera de los ficheros de la task.
Task 1: Ruling: `src/attempt.js` llegó escrito antes que sus tests y sin `test/attempt.test.js`; lo aparto a `.temp/sdd/plan/prev/` (sin borrarlo), escribo `test/attempt.test.js` desde el THEN, veo los dos RED y reescribo el código desde los tests — si estaba mal, el coste es reescribir ~6 líneas que ya estaban bien.
Task 1: Ruling: `attempt` resuelve `scripts/slow-gate.mjs` respecto al propio módulo (`import.meta.url`) y no al directorio de trabajo — con la ruta relativa, ejecutarlo desde otra carpeta no encuentra el script y devuelve `fallo` siempre — si estaba mal, cuesta una línea.
Task 1: Ruling: con la comprobación en verde, `attempt` devuelve `reservada <sala>`; la spec no dice qué se devuelve en ese caso y la comprobación de hoy no pasa nunca, así que no hay test que lo cubra — si estaba mal, cambia el texto de una rama que hoy no se alcanza.
Task 1: complete (commits c9f43b1..c8788e3, tests: node --test → ℹ duration_ms 30227.1708)
