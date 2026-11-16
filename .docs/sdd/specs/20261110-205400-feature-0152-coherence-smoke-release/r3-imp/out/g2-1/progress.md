# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

## Pre-flight scan

| Elemento | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares de tasks) | Tests RED (`report.test.js`, `attempt.test.js`) contra el código (`attempt`, `failureReport`) y los ficheros que crea | Coherente. `attempt.test.js` ejerce el THEN real; `scripts/slow-gate.mjs` tarda 30 s y sale con 1: el test es lento (~30 s) pero no se toca (No entra). |

Task 1: Ruling: el borrador `src/attempt.js` existía sin RED visto y faltaba `test/attempt.test.js` — aparto el borrador fuera del repo (scratchpad r0023/borrador), escribo `attempt.test.js`, veo el RED y reescribo el código — si fuera innecesario, solo cuesta rehacer 6 líneas.
Task 1: Ruling: `attempt` resuelve `scripts/slow-gate.mjs` respecto al módulo (`import.meta.url`) y no al cwd, como hacía el borrador — así funciona lanzado desde cualquier directorio (comprobado desde `test/`) — si se quería relativo al cwd, se revierte una línea.
Task 1: Ruling: mantengo la rama de éxito del borrador (`reservada <sala>`), que la spec no fija y ningún test cubre porque `slow-gate.mjs` siempre sale con 1 y no entra cambiarlo — si el texto no es el deseado, lo fija una feature posterior.
Task 1: Ruling: `test/report.test.js` se conserva tal cual lo escribió el dev-lead; el THEN lo cubre `test/attempt.test.js`, que escribí en el hilo y vi en RED (módulo inexistente) — sin coste.
Task 1: complete (commits f0bbfc4..58ae43b, tests: node --test → ℹ duration_ms 30192.1493)
