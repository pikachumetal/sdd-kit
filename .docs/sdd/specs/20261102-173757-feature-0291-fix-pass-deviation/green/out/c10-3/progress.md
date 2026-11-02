# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 99aaa1d..cff2cc3, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits cff2cc3..92b8327, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: datos (campo reason en memoria, src/app.js; previsto en la spec) → no sale
Final: fixed reasonOf conserva los espacios del motivo — "cancelar ignora los espacios alrededor del motivo" RED→GREEN, suite 6/6 (e894f0e)
Final: fixed test de canceladas dependiente del orden — "canceladas enseña sala, día y motivo" RED aislado→GREEN, suite 6/6 (e894f0e)
Final: Ruling: recortar el motivo no toca la spec — "sala ocupada " se trata como el motivo de la lista; el AND de motivo fuera de la lista sigue igual para lo que de verdad está fuera — si se equivoca, quitar un trim y su test
Final: desvío abierto: separador ` — ` → ` - ` de canceladas (Minor del eje Código con review.minors: fix) cambia la decisión 4 y el THEN del listado — corrección sin commitear en spec.md, código sin tocar, espera aprobación; aprobado va como Task 3 — enmienda 2026-11-02
