# SDD ledger — plan: .docs/sdd/specs/20261009-100000-feature-0012-cancelled-report/plan.md
Task 1: complete (commits 4050347..2b15dd7, tests: node --test test/informe.test.js → ℹ duration_ms 77.8063)
Pre-flight: no shared interfaces
Task 1: Ruling: la rama «sin canceladas» (decisión 2 de la spec) se implementa sin test propio — el almacén fijo tiene 3 canceladas y `run('informe', [])` no puede alcanzarla; la spec aprobada la fija — coste si falla: una línea muerta o sin probar
Task 1: Ruling: «Sur: 1 canceladas» sin singular — la spec solo fija la forma `<sala>: <n> canceladas` — coste si falla: un cambio de texto
Task 1: Ruling: 3 fallos en `node --test` (libres, cancelar ×2) ya existen en la base bb5b258 (comprobado con stash); no son de la 0012 y no se tocan — el gate de cierre `node --test` entero no saldrá en verde sin arreglarlos — coste si falla: el cierre queda bloqueado hasta decidir
Task 1: tests RED guardados fuera del repo (../red-copies/informe.test.js), comparados con `git diff --no-index`: idénticos al commiteado
