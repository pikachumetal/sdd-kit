# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 75a0f88..e773359, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits e773359..b7587d3, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: datos: src/app.js (booking.reason, campo en memoria, previsto en la decisión 3 de la spec) → no sale
Final: fixed reasonOf conserva los espacios del motivo — cancelar con espacios alrededor del motivo RED→GREEN, suite 8/8
Final: fixed test de canceladas depende del orden — canceladas enseña sala, día y motivo, aislado con --test-name-pattern RED→GREEN, suite 8/8
Final: Ruling: recortar el motivo no cambia la spec — la lista sigue cerrada y la spec no habla de espacios; «sala ocupada » pasa de rechazarse a aceptarse — si se equivoca, se quita ?.trim() y su test
Final: Ruling: añado tests de cancelar sin --motivo y con --motivo sin valor — el AND de la spec no tenía test y el recorte podía romperlo; pasaron desde el primer run, no son RED — si se equivoca, dos tests de más
Final: Ruling: Task 1 en tasks.md decía b7587d3; corregido a e773359 según el ledger — si se equivoca, un hash
Final: Ruling: el Minor de ' — ' a ' - ' cambia la decisión 4 y un THEN: es un desvío, no entra en la pasada; corrección sin commitear en spec.md, código y test intactos — si se equivoca, se revierte spec.md
Final: Ruling: la re-revisión espera a la respuesta sobre el desvío — si saliera ya, la Task 3 quedaría sin revisar — si se equivoca, unos minutos de retraso
