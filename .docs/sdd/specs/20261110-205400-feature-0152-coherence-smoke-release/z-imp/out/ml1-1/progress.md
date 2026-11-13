# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md

Pre-flight: una sola task, sin pares que compartan fichero ni interfaz; su texto concuerda con la spec. Limpio.
Task 1: Ruling: save/load van en la entrada de la CLI de src/app.js, no dentro de cancelBooking ni al importar — cancel.test.js y app.test.js llaman a run() en el cwd del repo y escribirían data/bookings.json, rompiendo libres en la siguiente ejecución; la salida observable no cambia — si se quiere guardar desde cancelBooking, el cambio es mover la llamada y aislar los tests.
Task 1: complete (commits 9fc4509..b900132, tests: node --test test/persist.test.js → ℹ duration_ms 384.3148)
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: módulo nuevo src/store.js (sin dependencia nueva, sin contrato entre módulos más que load/save) → sale
Final: Ruling: revisión final sin herramienta de subagentes — self-review de los ejes Spec, Código y Arquitectura por el autor — más débil que revisores frescos — el dev-lead decide si basta antes del merge
Final: Spec: cumple ambos THEN (cancelar + libres en otra ejecución → «Norte, Sur»; sin guardado → «Sur»); salida de comandos sin cambios; solo se guardan las reservas
Final: Código: sin hallazgos Critical ni Important
Final: minor (deferred): cancelar sin reserva también reescribe data/bookings.json con los mismos datos
Final: minor (deferred): un data/bookings.json corrupto hace fallar la CLI con un JSON.parse sin mensaje en castellano
Final: minor (deferred): anular no se persiste (la spec solo cubre cancelar)
Final: Gate: `node --test` → 6/6
