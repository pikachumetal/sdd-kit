# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 4487ba9..ddd904f, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits ddd904f..f5b6936, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed src/app.js:14-17 reasonOf conserva espacios — cancelar recorta los espacios del motivo RED→GREEN, suite 6/6
Final: fixed test/cancel.test.js:13 test canceladas dependía del orden — suite 6/6 (el test pasa también solo)
Final: Ruling: recorte del motivo no está en el spec (ni THEN ni Enmiendas) — es tolerancia de entrada que no cambia ningún THEN ni el listado; quien copia el motivo con un espacio ya puede cancelar — si se quiere exacto, se revierte una línea
Final: Ruling: el test de recorte comprueba solo la rama «sin reserva» y no el motivo guardado — el código es una línea y la re-revisión lo da por resuelto — un recorte roto en el guardado no lo vería el test
