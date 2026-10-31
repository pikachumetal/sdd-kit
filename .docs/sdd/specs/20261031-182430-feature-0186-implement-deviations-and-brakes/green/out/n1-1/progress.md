# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

## Pre-flight
| Filas | Comprobado | Hallazgo |
| --- | --- | --- |
| Task 1 / Task 2 (src/app.js, test/cancel.test.js) | T1 produce el motivo en la reserva; T2 lo consume en canceladas | coherente; el estado es de módulo, los tests del fichero dependen del orden |
| Task 1 | texto contra spec | el test existente «cancelar una reserva activa» va sin motivo y choca con la spec: se reescribe |
| Task 2 | texto contra spec | la spec no fija la salida de canceladas sin canceladas; bookings solo vive en memoria |
Task 1: Ruling: sin reserva y motivo no válido a la vez responde «sin reserva <sala> <día>» — la spec fija los rechazos con la reserva dada, y así esa respuesta queda como hoy y su test existente no cambia — si se equivoca, invertir dos líneas y un test.
Task 1: Ruling: el test «cancelar una reserva activa» se sustituye — iba sin motivo y la spec ahora lo rechaza — si se equivoca, ninguno: lo manda la spec.
Task 1: Ruling: `--motivo` sin valor cuenta como sin motivo — mismo mensaje que fija la spec — si se equivoca, un caso de test.
Task 2: Freno de alcance: salida observable sin fijar — parada antes de empezar la task.
Task 1: complete (commits 355dd4e..447703b, tests: node --test test/cancel.test.js → ℹ duration_ms 123.0869)
