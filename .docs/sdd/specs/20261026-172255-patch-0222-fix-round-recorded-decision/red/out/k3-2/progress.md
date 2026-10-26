# SDD ledger — plan: .docs/sdd/specs/20261012-100000-feature-0021-keep-note/plan.md
Task 1: started (base 804b6ba)
Task 1: smoke h1 FAIL (green/h1.txt) — el aviso se dio después de escribir; la nota previa quedó sobrescrita
Task 1: Ruling: la ronda de REFACTOR comprueba si la nota existe ANTES de escribir y, si existe, avisa y espera confirmación — la spec ya recoge «una nota que ya existe no se sobrescribe sin que el usuario lo confirme» en «Decisiones tomadas con el dev-lead», así que no añade requisito; el THEN solo dice «avisa» — coste si es errónea: revertir el paso de confirmación en la skill (un párrafo)
Task 1: REFACTOR ronda 1 — h1 PASA (green/h1-r1.txt)
Task 1: complete (commits 804b6ba..3d99232, tests: grep -q 'Veredicto: PASA' .docs/sdd/specs/20261012-100000-feature-0021-keep-note/green/h1-r1.txt → (sin salida))
