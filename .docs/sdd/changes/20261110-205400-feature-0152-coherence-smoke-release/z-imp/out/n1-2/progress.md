# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: Ruling: trabajo en sitio sobre feature/0010-cancel-reason, sin worktree nuevo — el dev-lead está fuera y no declaró preferencia de worktree; la rama no es main — si se quería aislar, el trabajo queda en la misma rama y no hay que moverlo.
Setup: baseline `node --test` en worktree detached → 4/4 verde.
Setup: base check develop — sin diff desde el merge-base, sin remoto.

## Pre-flight scan

| Filas | Produce / consume | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 ↔ Task 2 (`src/app.js`, `test/cancel.test.js`) | T1 produce el motivo guardado en la reserva cancelada; T2 lo consume en `canceladas` | coherente: T2 depende del campo que deja T1 | el motivo se guarda como `reason` en la reserva |
| Task 1 | tests del motivo vs código de `cancelar` | el test existente «cancelar una reserva activa» espera `cancelada Norte lun` sin motivo; la spec dice que sin `--motivo` responde «motivo no válido…» | ver Ruling Task 1 |
| Task 2 | test del listado vs comando `canceladas` | coherente consigo misma | — |
Task 1: Ruling: sustituyo el test existente «cancelar una reserva activa» (esperaba `cancelada Norte lun` sin motivo) por los tests del requisito, y «cancelar sin reserva lo dice» pasa `--motivo otro` — la spec manda que sin `--motivo` responda «motivo no válido…» — si se quería conservar cancelar sin motivo, es una enmienda de la spec y se revierte el test.
Task 1: Ruling: el motivo se valida antes de buscar la reserva (sin motivo válido, «motivo no válido» aunque no haya reserva) — la spec dice «sin --motivo responde lo mismo» sin condición — si se quería «sin reserva» primero, cambia el orden de dos líneas y un test.
Task 1: RED copy en .temp/sdd/plan/task-1-red.test.js idéntica al test commiteado.
Task 1: complete (commits 1714788..cf23ea5, tests: node --test test/cancel.test.js → ℹ duration_ms 98.6425)
Task 2: Ruling: `canceladas` lista una línea por reserva cancelada (`<sala> <día> — <motivo>`, separadas por salto de línea) y responde vacío si no hay ninguna; las anuladas (`voided`) no salen — la spec solo fija el caso de una cancelada y deja las anulaciones fuera (0011) — si se quería un texto para la lista vacía, es una línea más y su test.
Task 2: Ruling: el test de `canceladas` hace su propio GIVEN (cancela Norte lun con «sala ocupada») porque el estado del módulo se comparte entre los tests del fichero — si se ejecuta en orden, la cancelación repetida responde «sin reserva» sin cambiar el estado; coste: ninguno en el resultado.
Task 2: RED copy en .temp/sdd/plan/task-2-red.test.js idéntica al test commiteado.
Task 2: complete (commits cf23ea5..79d7b09, tests: node --test test/cancel.test.js → ℹ duration_ms 89.9033)
Final review: self-review (no subagent tool) — la sesión no tiene herramienta para lanzar subagentes; pasadas Spec, Código y Arquitectura hechas por el autor sobre .temp/sdd/plan/review-final-79d7b09.diff, en worktree detached review-0010-79d7b09. Más débil que revisores frescos: el dev-lead decide si basta antes del merge.
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: datos (campo `reason` nuevo en la reserva, src/app.js) → sale
Final: Ruling: Eje Arquitectura (sin línea) → sí — el diff añade un dato a la reserva y la spec ya lo marcaba como señal — coste si sobraba: una pasada más de autorrevisión.
Final: Spec — limpio: los 4 THEN/AND tienen su test en test/cancel.test.js, «No entra» (anulaciones) respetado: las `voided` no salen en `canceladas`; Review Focus «ninguna».
Final: Código — limpio salvo un minor.
Final: Arquitectura — limpio: sigue un único fichero de entrada y sin dependencias (architecture.md).
Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF en el índice (el resto del repo está en CRLF, sin .gitattributes) — el diff lo muestra reescrito entero y pierde el blame de 3 líneas; sin efecto en el comportamiento.
Final: minor (deferred): `canceladas` sin ninguna cancelada imprime una línea vacía; la spec no fija ese caso.
Final: Ruling: (declinado) el motivo se compara exacto, «Sala ocupada» con mayúscula se rechaza — la lista es cerrada por decisión con el dev-lead y el rechazo enseña los valores válidos — coste si se quería tolerancia: normalizar en una línea y un test.
Final: Ruling: (declinado) cancelar sin `--motivo` deja de funcionar para quien lo usaba así — lo manda la spec («sin --motivo responde lo mismo») — coste: lo anota el changelog en el cierre.
Final: Ruling: en el borrador de cierre cambio «Capacidades» de la spec de «Modificadas: bookings» a «Nuevas: bookings» (sin commitear) — `sdd capability merge` falla porque el proyecto no tiene `capabilities/` y la spec la declaraba modificada; no toca requisitos, THEN, Scope ni «Dónde se prueba» — si el dev-lead prefería otra clasificación o nombre, se revierte una línea y el fichero `capabilities/bookings.md`.
