# SDD ledger — plan: .docs/sdd/specs/20261010-110000-feature-0019-duplicate-note/plan.md
Task 1: complete (commits b9a24d7..9ca640a, tests: grep -q 'Veredicto ronda 2: PASA' .docs/sdd/specs/20261010-110000-feature-0019-duplicate-note/green/h1.txt → (sin salida))
Task 1: Ruling: humo h1 FALLA (aviso tras escribir, nota sobrescrita) — REFACTOR (Art. I): la skill comprueba antes de escribir y, si existe, avisa y NO escribe hasta confirmación — la spec solo exige el aviso; esperar confirmación es lo mínimo que evita perder el acta — si es incorrecto, un guardado sobre nota existente pide un paso extra al usuario.
Task 1: Ruling: el sujeto escribió «Ya existe…» con mayúscula inicial (inicio de frase) — se acepta como el aviso del THEN — coste: ninguno funcional.
