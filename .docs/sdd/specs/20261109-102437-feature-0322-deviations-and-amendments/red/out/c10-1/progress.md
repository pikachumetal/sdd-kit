# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits fe941c1..9c7121e, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 9c7121e..b11eff3, tests: node --test test/cancel.test.js → 3/3 pass)
Final: fixed canceladas depende del orden (Spec, Minor) — «canceladas enseña sala, día y motivo» RED (aislado: '' ≠ esperado)→GREEN, suite 6/6 · 38f98ae
Final: Ruling: añado test del AND «sin --motivo», que no tenía — el código ya cumplía, sin RED — coste si mal: ninguno
Final: Desvío: trim del motivo (Código, Important) cambia la salida del CLI y añade un AND — parado, enmienda en spec.md sin commit
Final: Desvío: separador ` - ` (Código, Minor) cambia el THEN de canceladas y la decisión 4 — parado, enmienda en spec.md sin commit
