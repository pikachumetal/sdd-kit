# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 2888b39..e2601fb, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits e2601fb..efc0f48, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (src/app.js, test/cancel.test.js, docs; sin manifiestos) → no sale
Final: Ruling: tasks.md no entró en el commit de la Task 1 y apuntaba la Task 1 a efc0f48 — corregido a e2601fb y entra en el commit de la pasada de fix — coste si erróneo: ninguno, es registro
Final: Ruling: Código Important «reasonOf no recorta espacios» — el código se queda: recortar cambia la respuesta de `--motivo "sala ocupada "`, que hoy cumple el AND «un motivo fuera de la lista responde motivo no válido…», y ninguna decisión del dev-lead fija ese caso; la respuesta lista los motivos válidos y la persona reintenta al momento — coste si erróneo: un reintento en recepción; aceptarlo es una enmienda de la spec
Final: Ruling: Código Minor «` — ` se ve mal en cp850» — el código se queda: la decisión 4 y el THEN «Norte lun — sala ocupada» fijan el separador; cambiarlo es una desviación — coste si erróneo: mojibake en la consola cp850 de recepción hasta una enmienda
Final: fixed Spec Minor «el test de canceladas depende del orden» — canceladas enseña sala, día y motivo RED→GREEN (solo: '' → pasa), suite 6/6
Final: Ruling: añadido el test «cancelar sin --motivo» del AND que no tenía test (ningún eje lo marcó) — pasa a la primera, el código ya lo cumplía — coste si erróneo: ninguno
Final: re-revisión efc0f48..c96fa20 (opus+high): todo atendido, sin rotura nueva; Rulings sostenidos
Final: revisado en el hilo: 399a597 · tasks.md · 2 líneas
