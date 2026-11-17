# SDD ledger — plan: .docs/sdd/specs/20261010-110000-feature-0019-duplicate-note/plan.md
Task 1: Ruling: h1 FALLÓ (aviso tras el Write, nota previa sobrescrita) — ronda de REFACTOR (Art. I): comprobar existencia antes de escribir, avisar y preguntar antes de sobrescribir; el cambio de comportamiento (no escribir sin confirmación) va más allá del literal del THEN «avisa» — si es incorrecto, la skill pregunta de más en vez de sobrescribir en silencio
Task 1: h1 relanzado (green/h1-r2.txt): PASA, diff de la nota previa vacío
Task 1: complete (commits d9c5cca..9005dd3, tests: grep -q 'Veredicto: PASA' .docs/sdd/specs/20261010-110000-feature-0019-duplicate-note/green/h1-r2.txt → (sin salida))
