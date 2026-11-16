# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (previa a la sesión)
Task 2: Ruling: enmienda aprobada por el dev-lead — el listado no enseña quién canceló (la app no tiene usuarios) — commit fae95fb — si era el titular de la reserva, hay que reabrir
Task 2: complete (commits fae95fb..3558961, tests: node --test test/cancel.test.js → ℹ duration_ms 128.5323)
Final: Eje Arquitectura: no en el plan (sin línea) · señales en el diff: ninguna (src/app.js función nueva, sin módulo, dependencia, contrato ni datos persistentes) → no sale
Final: Ruling: Spec Important «la premisa de la enmienda choca con el glosario (Reserva a nombre de quien la pide)» — el dev-lead vio este mismo punto antes de aprobar y eligió la opción 1 (quitar «quién»); el código sigue la spec enmendada — si «quién» era el titular, se reabre Task 2 y hay que añadir un titular a la reserva
Final: Ruling: Declined (Spec) memoria entre ejecuciones — ya era así, guardar es la 0014 — si se espera persistencia, canceladas sale vacío entre ejecuciones
Final: Ruling: Declined (Spec) anuladas fuera de canceladas — la 0011 las trata y el Scope las excluye — bajo
Final: Ruling: Declined (Spec) motivo sensible a mayúsculas — la lista es cerrada y literal — «Sala ocupada» se rechaza
Final: Ruling: Declined (Spec) motivo validado antes de buscar la reserva — la spec no fija orden — cancelar sin reserva ni motivo dice «motivo no válido»
Final: minor (deferred): sin --motivo dice «motivo no válido» en vez de «falta --motivo» (src/app.js:43)
Final: minor (deferred): `--motivo` en cualquier posición desplaza sala y día (src/app.js:38)
Final: minor (deferred): canceladas vacío imprime línea en blanco (src/app.js:52)
Final: minor (deferred): test de canceladas depende del estado del test 1 (test/cancel.test.js:98)
Final: minor (deferred): falta el test «sin reserva» con motivo válido y el de cancelar sin --motivo (test/cancel.test.js)
