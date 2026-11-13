# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits de0fa1a..0bb80b3, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 0bb80b3..2d5fe84, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed parseSince nunca marcaba missing (src/app.js:20-23) — 'canceladas --desde sin día avisa y no lista nada' RED→GREEN, suite 6/6
Final: minor (deferred): test/cancel.test.js:13 el test de canceladas depende del orden respecto al de cancelar
Re-revisión: 2d5fe84..7699226 despachada (sdd-kit:effort-high + opus)
Final: Ruling: re-revisión Minor tasks.md apuntaba a d28d4c5 (sha previo a un amend) — ya corregido a 7699226 en 07f84b4 — ninguno
Final: Ruling: fuera de alcance, `canceladas --desde sab` (día no válido) lista todo sin avisar — código previo al fix, fuera de lo que cubre la spec — un día mal escrito enseña la lista completa
Final: Ruling: el aviso de `--desde` sin día no está como escenario en spec.md — comportamiento que corrige un hallazgo, sin THEN nuevo en el delta; queda para ✋ — el dev-lead decide si lo escribe
