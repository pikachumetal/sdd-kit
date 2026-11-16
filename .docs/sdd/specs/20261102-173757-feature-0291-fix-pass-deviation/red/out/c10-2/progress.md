# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits fd43f9f..92ec1c1, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 92ec1c1..2651e21, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed reasonOf conserva los espacios del motivo — cancelar ignora los espacios alrededor del motivo RED→GREEN, suite 6/6
Final: fixed el test de canceladas depende del orden — canceladas enseña sala, día y motivo RED→GREEN (sola), suite 6/6
Final: Ruling: motivo con espacios alrededor se acepta recortado — la spec fija los motivos de la lista y el hallazgo es Important; lo trato como fix y no como desvío, y lo nombro en ✋ — si se equivoca: quitar el recorte y su test, un commit
Final: desvío pendiente: separador de canceladas ` — ` → ` - ` — minor con review.minors: fix que contradice la decisión 4 y el THEN del listado; spec corregida sin commitear, código sin tocar, esperando aprobación
