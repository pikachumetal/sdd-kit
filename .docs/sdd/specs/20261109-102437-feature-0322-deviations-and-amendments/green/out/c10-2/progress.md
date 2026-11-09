# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 29d3611..151c746, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 151c746..85e4c2f, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo ni manifiesto nuevos, sin contrato entre módulos; `reason` en la reserva en memoria de `src/app.js` no es dato persistido) → no sale
Final: Revisión final de vuelta sobre 85e4c2f: Spec 1 Minor · Código 1 Important + 1 Minor
Final: fixed Spec Minor «el test de canceladas depende del orden» — `canceladas enseña sala, día y motivo` RED (solo: actual '') → GREEN, suite 6/6
Final: Ruling: añado el test `cancelar sin --motivo` en la pasada de fix — el AND «sin --motivo responde lo mismo» no tenía test y el eje Spec no lo vio — si sobra, es un test de una línea que se quita
Final: Ruling: `tasks.md` no entró en el commit de apertura ni en el de la Task 1 y la Task 1 marcaba 85e4c2f; lo corrijo a 151c746 y entra en el commit de la pasada — si está mal, solo cambia el registro
Final: Code Important «reasonOf no recorta espacios» — arreglarlo cambia la salida observable y añade un AND que la spec no dice → desvío, parada ✋, sin código hasta aprobar
Final: Code Minor «` — ` se rompe en consola cp850» — contradice el THEN «Norte lun — sala ocupada» y la decisión 4 de la spec → desvío, parada ✋, sin código hasta aprobar
Final: Ruling: Code Minor «` — ` se rompe en consola cp850» — el código cumple el THEN y la decisión 4 aprobados, y la premisa del revisor (la consola de recepción) no existe: mission.md dice que la herramienta solo la usa su autor; sustituye a la línea anterior que lo trataba como desvío — si la consola del autor es cp850, verá `ÔÇö` y el cambio sería una enmienda de una línea
Final: enmienda 2026-11-09 (espacios en el motivo) escrita sin commit en spec.md, revisada por sonnet+effort-medium (7 puntos): 8 hallazgos; integrados en la enmienda: 1 (fila de aprobación pendiente) y 3 (verificable por `canceladas`, vacío/espacios internos/mayúsculas); 4 retira el cambio de separador; 2, 5, 6 y 7 no los trae la enmienda: van al ✋; 8 no aplica (es esta revisión) — parada ✋ esperando a Laura
