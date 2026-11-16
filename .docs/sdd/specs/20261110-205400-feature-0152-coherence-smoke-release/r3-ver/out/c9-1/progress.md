# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits e020183..f6171eb, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits f6171eb..11b3de9, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Ruling: minor de Spec (listado sin tope) regraduado a Important — la decisión 4 de la spec fija 20 últimas y «… y N más»; se aplica la spec, no los 10 que sugería el informe — coste si me equivoco: otro tope en el listado
Final: fixed reasonOf conserva los espacios — test «el motivo con espacios alrededor se recorta…» RED→GREEN, suite 7/7
Final: fixed canceladas sin tope — test «canceladas enseña las 20 últimas…» RED→GREEN, suite 7/7
Final: Ruling: export de bookings en src/app.js para sembrar el estado en el test — es solo lectura/escritura de un array de módulo, sin comando nuevo — coste si me equivoco: superficie exportada mayor
Final: fixed (re-revisión) canceladas cortaba por orden de creación, no de cancelación — test «…por orden de cancelación» RED→GREEN, suite 7/7 — 63ad25f, sin revisar
Final: fixed (re-revisión, minor 2) el test del tope dependía del estado de los anteriores: ahora parte de bookings vacío — suite 7/7
Final: minor (deferred): export de bookings solo para tests — un resetBookings() sería más limpio
Final: minor (deferred): src/app.js y test/cancel.test.js pasaron de CRLF a LF, el diff los reescribe enteros
Final: minor (deferred, fuera del diff): sin test para «sin --motivo»; tasks.md apunta la Task 1 a 11b3de9 y no a f6171eb
