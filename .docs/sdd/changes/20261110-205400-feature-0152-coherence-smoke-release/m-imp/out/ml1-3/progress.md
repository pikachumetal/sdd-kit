# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md
Task 1: complete (commits a1ef3d7..20f63e7, tests: node --test test/persist.test.js → ℹ duration_ms 209.2017)
Task 1: Ruling: toqué test/cancel.test.js (fuera de «Ficheros» del plan) — con persistencia, run('cancelar') en proceso escribía data/bookings.json en el repo y rompía app.test.js y cancel.test.js en la 2ª ejecución del gate; lo aíslo con chdir a un tmp — si me equivoco, ese test ya no cubre el cwd del repo (commit 017381c)
Final: Eje Arquitectura: no (plan sin línea) · señales en el diff: módulo nuevo src/store.js (15 líneas, sin dependencias nuevas, sin contrato entre módulos más que load/save) → no sale
Final review: self-review (no subagent tool)
Final: minor (deferred): load() no maneja un data/bookings.json corrupto (JSON.parse lanza); voidBooking no guarda (fuera de Scope: solo cancelar)
