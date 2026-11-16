# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 615c839..0eaed54, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 0eaed54..1f4c855, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo nuevo, sin dependencia en package.json, sin contrato ni datos nuevos) → no sale
Final: fixed reasonOf conserva los espacios del motivo (Código, Important) — «cancelar tolera espacios alrededor del motivo» RED→GREEN, suite 7/7
Final: fixed listado de canceladas sin tope (Spec, Minor, review.minors: fix) — «canceladas enseña como mucho las 20 últimas y cuenta el resto» RED→GREEN, suite 7/7
Final: Ruling: el revisor de Spec propone tope 10 — se aplica 20 y «… y N más», que es lo que fija la decisión 4 del dev-lead en el spec; el 10 no tiene respaldo — si el dev-lead quería otro tope, es cambiar una constante (listLimit)
Final: Ruling: orden de «las 20 últimas» = orden de la lista de reservas, no de la fecha de cancelación (no se guarda esa fecha) — con una sola reserva activa por sala y día coinciden en la práctica — un listado con otro orden si se cancela fuera de orden
Final: Ruling: `bookings` pasa a exportarse para poder sembrar 24 canceladas en el test del tope — solo lo usa el test — acopla el test a la forma interna
Final: Enmienda sin aprobar: AND del tope de 20 en el delta de `bookings` (aplica literal la decisión 4)
Final: fixed tasks.md: el commit de la Task 1 era 0eaed54, no 1f4c855 (Minor de la re-revisión; doc)
Final: Ruling: re-revisión Minor — «últimas» por orden de creación, no de cancelación (src/app.js:41) — ya ruling arriba; no hay fecha de cancelación que ordenar — mismo coste
Final: Ruling: re-revisión Minor — `bookings` exportado como costura de test (src/app.js:4) — ya ruling arriba; un cargador de fixtures añadiría API sin uso en producción — acopla el test al estado interno
Final: Ruling: re-revisión Minor — el test del tope depende del orden de los tests anteriores (test/cancel.test.js:20-26) — el módulo guarda estado global y los tests de la 0010 ya dependen del orden — ejecutado solo, falla con «… y 4 más»
