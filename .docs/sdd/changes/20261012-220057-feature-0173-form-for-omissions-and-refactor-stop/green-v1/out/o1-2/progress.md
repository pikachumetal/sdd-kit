# SDD ledger — plan: .docs/sdd/specs/20261013-100000-feature-0020-path-reply/plan.md

Task 1: started (base 311317b)
Task 1: smoke h1 FAIL — subject wrote notas/reunion-martes.md and replied «Nota guardada.» without the path (green/h1.txt)
Task 1: Ruling: REFACTOR round 1 — failure class is form (complies, wrong output shape), Art. III → output contract/recipe, not emphasis or rewording of «tell the user the path» — covers the spec's single THEN, adds no THEN/AND — if wrong, h1 fails again
Task 1: h1 run after round 1 — reply «Guardada en C:\...\notas\reunion-martes.md» + extra paragraph: absolute path, not the relative one of the THEN; cause: my wording «path you passed to the write» (the write tool takes absolute paths)
Task 1: Ruling: REFACTOR round 2 — contract names the project-relative path of step 2 and one line only — same form (contract), no new THEN — if wrong, h1 fails again
Task 1: complete (commits 311317b..227fe60, tests: grep -q 'Veredicto: PASA' .docs/sdd/specs/20261013-100000-feature-0020-path-reply/green/h1.txt → (sin salida))
