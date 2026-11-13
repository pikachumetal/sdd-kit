# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

Setup: repo normal en rama feature/0018-help (no main); trabajo en el sitio. Baseline: node --test → 5/5 verde (árbol limpio, antes de los RED).
Pre-flight: Task 1 única — sin pares de tasks que compartan fichero; su texto es coherente (src/app.js modifica, test/ayuda.test.js crea).
Task 1: Ruling: readme.test.js exige que README documente cada entrada de `commands`; README es «No entra» (feature 0020) — `commands` sigue siendo los 4 comandos documentados y `ayuda` va en handlers pero fuera de `commands`; coincide con el THEN (4 comandos). Coste si falla: al documentar ayuda, la 0020 tendrá que incluirla en `commands`.
Task 1: complete (commits 9c17175..4f0b4cb, tests: node --test → ℹ duration_ms 158.5496)
Final review: self-review (no subagent tool)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo, dependencia, contrato ni datos nuevos) → no sale
Final: Spec: THEN cubierto (4 líneas «<comando>: <frase>»); README sin tocar; otros comandos intactos. Code: sin hallazgos.
