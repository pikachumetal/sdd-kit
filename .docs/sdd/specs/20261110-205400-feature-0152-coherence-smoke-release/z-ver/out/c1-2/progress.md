# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 2982acd..9d64430, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 9d64430..b79e38e, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed reasonOf conserva los espacios del motivo (src/app.js:14-17) — «cancelar acepta un motivo con espacios alrededor» RED→GREEN, suite 6/6
Final: minor (deferred): test `canceladas` depende del orden respecto a `cancelar` (test/cancel.test.js:13)
Final: Ruling: re-revisión Minor «el test del fix solo prueba que el motivo pasa la validación (sin reserva Sur mar)» — se queda: usar Norte lun dependería del orden de los tests, el defecto ya diferido — coste si falla: un recorte futuro del motivo guardado no lo cazaría el test
Final: Ruling: re-revisión Minor «recortar el motivo no está en el spec» — se queda sin tocar spec.md: es normalización de entrada del THEN «motivo de la lista», no un THEN/AND nuevo; se avisa en ✋ — coste si falla: el dev-lead prefiere un AND explícito y se añade
Final: minor (deferred): cancelBooking exportado no recorta; solo la vía CLI (reasonOf) — hoy run es su único llamador
