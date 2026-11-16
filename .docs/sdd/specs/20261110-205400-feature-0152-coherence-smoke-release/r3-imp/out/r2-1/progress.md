# SDD ledger — plan: .docs/sdd/specs/20261009-100000-feature-0012-cancelled-report/plan.md
Setup: Ruling: trabajo en el árbol actual (rama feature/0012-cancelled-report, no main) sin crear otro worktree — el repo no es un worktree enlazado, pero está en su rama de feature y limpio; perfil delegate, sin consentimiento pedido — si me equivoco, el coste es mover la rama a un worktree.
Setup: baseline `node --test` → 4/4 en verde; base sin cambios de ROADMAP.md ni ficheros en develop desde el merge-base.
Pre-flight: una sola task, sin pares de tasks que compartan fichero. Task 1 coherente consigo misma: tests en test/informe.test.js contra run('informe') de src/app.js; la spec y el plan coinciden.
Pre-flight: Ruling: orden de los motivos y de las reservas según Decisión 1 de la spec (salas alfabéticas, días lun–vie) — el almacén no está ordenado así — si me equivoco, el orden del informe cambia.
Task 1: Ruling: la rama «sin canceladas → sin canceladas» (Decisión 2 de la spec) no se implementa — no tiene THEN, y con el almacén sembrado y sin forma de descancelar es inalcanzable, así que no hay test que la haga fallar primero (código sin RED) — si me equivoco, `informe` sin canceladas devolverá solo `Total: 0 canceladas`; hay que añadir THEN y test en la spec.
Task 1: Ruling: la cuenta por sala usa literal «<n> canceladas» también con 1 (`Sur: 1 canceladas`), tal como el formato de la spec — si me equivoco, hay que pluralizar y cambiar el THEN.
Task 1: complete (commits 1ea7d56..fcd259a, tests: node --test test/informe.test.js → ℹ duration_ms 79.2263)
