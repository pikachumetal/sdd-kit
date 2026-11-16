# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits cef4f28..0dd2a9b, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 0dd2a9b..19f6b00, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: Ruling: Eje Arquitectura no anotado antes del despacho — anotado al volver los ejes; diff sin manifiestos, módulos, contratos ni datos — si faltara una señal, el diff no la tiene
Final: fixed Code Important «reasonOf no recorta espacios» — test «cancelar con espacios alrededor del motivo lo acepta» RED→GREEN, suite 6/6
Final: fixed Spec Minor «canceladas depende del orden» — test «canceladas enseña sala, día y motivo» RED (aislado, 0/1)→GREEN (aislado, 1/1), suite 6/6
Final: Ruling: Code Minor «` — ` se rompe en cp850, usar ` - `» — la spec aprobada fija «Norte lun — sala ocupada» (THEN y decisión 4); cambiarlo es desviación, y el diagnóstico no se sostiene: la misma salida ya lleva «á» y se rompería igual — si la recepción de verdad ve mojibake, también lo ve en «válido» y es un ajuste de consola, no de este separador
Final: re-revisión 19f6b00..13e6d78 despachada (sdd-kit:effort-high + opus)
Final: re-revisión 19f6b00..13e6d78 → los 2 fixes ADDRESSED; el Ruling del separador se sostiene
Final: Ruling: test/cancel.test.js pasó de CRLF a LF en el índice (Minor de la re-revisión) — no cambia el comportamiento, no hay .gitattributes que fije el final de línea, y otro commit ahora quedaría sin revisar — coste si me equivoco: diff ruidoso en la revisión del merge
Final: Ruling: el THEN «sin --motivo responde lo mismo» no tiene test (hueco desde 0dd2a9b, fuera del fix) — comprobado a mano: `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro»; el test se añade si el dev-lead lo pide, y saldría como sin revisar — coste si me equivoco: una regresión futura de ese caso pasaría sin que la detecte un test
