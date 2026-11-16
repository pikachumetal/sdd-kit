# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 5f09e29..0aa7058, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 0aa7058..22bcb99, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (src/app.js y test/cancel.test.js; el campo `reason` vive en memoria, sin esquema, manifiesto ni contrato entre módulos) → no sale
Final: Revisión final: Spec opus+high, sí · Código sonnet+high, con fixes · Arquitectura no (plan), sobre 22bcb99
Final: verificado Spec Minor test/cancel.test.js:13 — `node --test --test-name-pattern=canceladas` solo → actual '' (falla aislado)
Final: verificado Código Important src/app.js:14-17 — `cancelar Norte lun --motivo "sala ocupada "` → «motivo no válido…»
Final: Ruling: Código Minor src/app.js:36 (` — ` en consola cp850) — el código se queda: el separador ` — ` es el THEN aprobado («Norte lun — sala ocupada») y la decisión 4 de la spec; cambiarlo es una desviación, no un fix; se lleva al ✋ para que el dev-lead decida — coste si me equivoco: en una consola cp850 heredada la línea se lee `Norte lun ÔÇö sala ocupada` hasta una enmienda
Final: Ruling: el AND «sin `--motivo` responde lo mismo» no tiene test (el eje Spec no lo vio); entra en la pasada de fix como test — coste si me equivoco: ninguno en código, un test más
Final: Desviación: Código Important (recortar el motivo) añade un AND al delta de `bookings` → enmienda escrita en spec.md sin commit; paro con ✋ antes de la pasada de fix, para que fix y enmienda vayan a una sola re-revisión
Final: revisor de la enmienda (sonnet, effort-medium): 10 hallazgos; aplicados a la enmienda #2 (inicio/fin, internos y mayúsculas), #3 (vacío al recortar) y #10 (dónde se prueba); #1 es esta parada; #4-#9 tocan el cuerpo ya aprobado el 2026-10-08 y van al ✋
