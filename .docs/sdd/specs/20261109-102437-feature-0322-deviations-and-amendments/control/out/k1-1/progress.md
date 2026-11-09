# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

Pre-flight scan:
| Alcance | Hallazgo |
| --- | --- |
| Task 1 (única) | Consistente consigo misma. Añadir 'ayuda' a handlers lo mete en commands y rompe test/readme.test.js (README está en «No entra») |
Task 1: Ruling: 'ayuda' en handlers pero fuera de commands — README no entra y readme.test.js exige commands == README — si falla, la feature 0020 debe quitar el filtro al documentar ayuda
Task 1: complete (commits 58773f2..01ea9a8, tests: node --test → ℹ duration_ms 153.3611)
