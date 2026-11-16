# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits a0d4f5e..da54e99, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits da54e99..33cfb16, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (solo src/app.js y test, sin manifiestos nuevos) → no sale
Final: Ruling: corrijo la línea anterior de Eje Arquitectura — el diff de package.json añade la dependencia zod (señal «nueva dependencia») → Eje Arquitectura no → sí — la miré sin leer el manifiesto — coste si me equivocara: dependencia sin revisión de arquitectura
Final: Revisión final sobre 33cfb16 — Spec opus+high: con arreglos · Código sonnet+high: con arreglos · Arquitectura opus+high: con arreglos (subido: package.json añade zod)
Final: fixed zod sin uso ni declarado (Spec/Código/Arquitectura, Important) — package.json vuelve a {"type": "module"}, suite 7/7
Final: fixed AND «sin --motivo» sin test (Spec, Important) — test «cancelar sin --motivo pide un motivo de la lista» RED→GREEN (mutación: reasonOf con 'otro' por defecto), suite 7/7
Final: fixed rama «sin reserva» sin test tras da54e99 (Código, Important) — test «cancelar una reserva que no existe lo dice», suite 7/7
Final: Ruling: test de canceladas acoplado al orden (Código, Important; Spec Minor) — el ADR 0003 acepta «los tests no limpian nada»; cada test nuevo mío no cambia el estado — coste si me equivoco: --test-name-pattern aislado falla
Final: Ruling: orden de comprobación en cancelBooking (motivo antes que reserva) (Arquitectura, declined) — con motivo inválido y sin reserva se informa del motivo; el spec fija ese mensaje para motivo inválido — coste: mensaje menos específico
Final: Ruling: --motivo antes de sala/día o motivo sin comillas (Spec, declined) — el spec fija la forma «cancelar <sala> <día> --motivo <motivo>» — coste: mensaje poco claro
Final: Ruling: anular sin motivo / reservas perdidas al cerrar (Spec, declined) — fuera de alcance (0011) y decisión del ADR 0003 — coste: ninguno
Final: minor (deferred): test de motivo inválido usa Sur mar (reserva inexistente) en vez del GIVEN de Norte lun
Final: minor (deferred): canceladas sin canceladas imprime línea vacía; sin test ni requisito
Final: minor (deferred): cancelar sin --motivo da el mismo mensaje sin pista de uso (texto fijado por el spec)
Final: minor (deferred): reasonOf lee --motivo por índice; sala/día leídos aparte; cancelar --motivo otro Norte lun
Final: minor (deferred): orden de helpers en src/app.js; voidBooking sin test (previo)
Final: re-revisión 33cfb16..d08f441 opus+high — 3/3 ADDRESSED, sin breakage Critical/Important
Final: minor (deferred): test «sin --motivo» corre con Norte lun ya cancelada, no con la reserva activa del GIVEN; pasa solo por el orden de comprobaciones
Final: Ruling: precisión — la re-revisión dice que citar el ADR 0003 para el acoplamiento por orden es forzado (el ADR habla de no persistir, no de tests dependientes); el estado compartido sigue siendo el GIVEN del spec y node:test ejecuta en orden — coste: fallo al aislar con --test-name-pattern
