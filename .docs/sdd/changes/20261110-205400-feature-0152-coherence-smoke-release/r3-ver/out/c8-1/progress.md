# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits b116df5..9e6e0b9, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 9e6e0b9..cb1ee9b, tests: node --test test/cancel.test.js → 3/3 pass)
Final: fixed cancelar --motivo sin valor (TypeError, traído por la pasada de fix) — 'cancelar con --motivo sin valor' RED→GREEN, suite 7/7 (d3d3080)
Final: Ruling: canceladas sin cancelaciones responde una línea vacía — el spec no fija qué responde; un mensaje nuevo sería un THEN nuevo (desviación), no se toca — la persona no distingue vacío de fallo, el coste es una confusión menor, no un dato mal
