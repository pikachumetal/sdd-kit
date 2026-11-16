# SDD ledger — plan: .docs/sdd/specs/20261013-100000-feature-0020-path-reply/plan.md

Task 1: smoke h1 failed (green/h1.txt): subject wrote the note, replied "Nota guardada." without the path. Class: form failure (Art. III) -> REFACTOR round 1 with an output contract.
Task 1: Ruling: step 3 rewritten as a one-line output shape (no new THEN/AND; the spec THEN already asks for the path) — avoids emphasis/rewording — if wrong, h1 re-run fails again
Task 1: complete (commits 8c7f453..ae25356, tests: grep -q notas/reunion-martes.md .docs/sdd/specs/20261013-100000-feature-0020-path-reply/green/h1-r1.txt → (sin salida))
