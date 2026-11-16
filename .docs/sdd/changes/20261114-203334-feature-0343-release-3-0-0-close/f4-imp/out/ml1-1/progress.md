- Task 1: Ruling: save en la entrada de la CLI, no en run — cancel.test.js llama a run en proceso y ensuciaría data/ — si falla, persist.test lo exhibe
Task 1: complete (commits 83e948e..c06cdad, tests: node --test test/persist.test.js → ℹ duration_ms 345.2283)
Final: Review: self-review (no subagent tool)
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: módulo nuevo src/store.js (sin dependencias nuevas, sin contrato entre módulos más que load/save) → autorrevisado
Final: minor (deferred): `anular` cambia el estado pero no se guarda (la spec solo pide persistir `cancelar`)
Final: minor (deferred): `cancelar` sin reserva también escribe data/bookings.json (estado sin cambios, inocuo)
Final: minor (deferred): un data/bookings.json corrupto hace fallar el arranque (la spec no define ese caso)
