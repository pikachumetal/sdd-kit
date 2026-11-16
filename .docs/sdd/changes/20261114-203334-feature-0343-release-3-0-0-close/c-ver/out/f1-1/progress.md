# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits deae620..710f45d, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 710f45d..a89fc75, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (solo src/app.js y test/cancel.test.js; sin módulo nuevo, sin manifest, sin contrato entre módulos, sin datos persistentes: ADR 0003 en memoria) → no sale
Final: Efforts: sdd-kit:effort-high disponible en el harness; Spec opus, Code sonnet
Final: Revisión final recibida sobre a89fc75 — Spec opus+high: With fixes (0 Critical, 3 Important, 2 Minor, 3 no verificado) · Código sonnet+high: With fixes (0 Critical, 3 Important, 5 Minor)
Final: fixed «sin --motivo sin test» (Spec I1) — test «cancelar sin --motivo responde lo mismo» RED→GREEN por mutación (reason && …), suite 8/8
Final: fixed «sin reserva sin test» (Spec I2, Code I2) — tests «sin reserva … motivo válido» y «no toca la reserva de otro día» RED→GREEN por mutación (ignora el día), suite 8/8
Final: fixed «test de canceladas depende del estado de otra» (Code I1, Spec M1) — la test cancela su precondición; pasa aislada (--test-name-pattern) — suite 8/8
Final: Ruling: la test «no toca la reserva de otro día» va la primera del fichero — el estado de bookings es del módulo y sin ese orden la mutación «ignora el día» no la rompe — si alguien reordena, pierde fuerza, no falla en falso
Final: Ruling: Declined to judge (Spec) «motivo sin comillas en el shell», «--motivo antes de la sala», «mayúsculas del motivo», «persistir entre ejecuciones», «CHANGELOG/README», «validar motivo antes que la reserva» — la spec fija la lista cerrada y el mismo mensaje sin --motivo; persistir lo veda el ADR 0003 — mejoras de uso, no defectos; coste si me equivoco: fricción de uso
Final: Ruling: Declined to judge (Code) «voidBooking sin motivo», «process.argv y dispatcher previos» — 0011 queda fuera de Scope y el dispatcher es anterior a la rama — coste nulo
Final: Ruling: Declined to judge (Code) «bookings en memoria sin reset» — lo decide el ADR 0003 — ya cubierto por el ruling del orden de tests
Final: minor (deferred): falta --motivo y valor inválido comparten mensaje (Code M1; la spec lo manda igual)
Final: minor (deferred): cancelar lee sala y día por posición, --motivo antes de la sala los lee mal (Code M2 / Spec declined)
Final: minor (deferred): sin test del orden motivo-antes-que-reserva (Code M3)
Final: minor (deferred): cadena de if en run crece con cada comando (Code M4, previo a la rama)
Final: minor (deferred): reasonOf es un helper de una sola bandera (Code M5)
Final: minor (deferred): la spec salta la decisión 2 en «Decisiones que he tomado yo» (Spec M2)
Final: PARKED-DEVIATION: canceladas vacío imprime una línea en blanco (Spec I3, Code I3) — arreglarlo añade un THEN que la spec no tiene: desviación, espera ✋ del dev-lead
Final: Pasada de fix: 4c991bf, 3 hallazgos RED→GREEN (test-only, 1 desviación pendiente)
Final: Re-revisión despachada: a89fc75..4c991bf, sdd-kit:effort-high + opus
Final: revisión de spec de la enmienda (sonnet): aceptados #5 (GIVEN preciso, salida exacta), #6 (Dónde se prueba), #7 y #8 (Enmiendas autocontenida, título limpio); rechazado #4 (no es MODIFIED: el caso vacío no lo cubre ningún requisito aprobado, el ADDED no cambia su salida con canceladas); #1/#2/#3/#9/#10 van al ✋ del dev-lead (re-aprobación, decisión 2 perdida, texto y código de salida)
Final: Re-revisión: a89fc75..4c991bf, sdd-kit:effort-high + opus, todo ADDRESSED, sin Critical ni Important nuevos; 1 Minor nuevo (aviso del orden) cerrado en 87336c2
Final: revisado en el hilo: 87336c2 · test/cancel.test.js · 1 línea (solo un comentario)
Final: Out-of-scope (re-revisión): el GIVEN de «sin --motivo» solo se cumple si la test corre sola; la aserción falla igual bajo toda mutación — sin acción
