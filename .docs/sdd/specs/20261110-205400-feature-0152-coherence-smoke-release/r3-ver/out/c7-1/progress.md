# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 0d2765c..fb87386, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits fb87386..72b4cdb, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed parseSince nunca marca missing (src/app.js:20-23) — 'canceladas --desde sin día avisa y no lista nada' RED→GREEN, suite 4/4 (cde7e91)
Final: Ruling: el texto «indica un día: …» lo fija el revisor; el spec solo dice «--desde <día>» y no cambia ningún THEN — se queda — coste si falla: otro texto de aviso
Final: minor (deferred): el test 'canceladas' depende del orden respecto a 'cancelar' (test/cancel.test.js:13)
Final: minor (deferred): --desde con un valor que no es día (p. ej. «dom») lista todo sin avisar (src/app.js:22,43; ya existía; el spec no dice qué hacer)
Final: minor (deferred): falta un test del filtro normal --desde <día>
