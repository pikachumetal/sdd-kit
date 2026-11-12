# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 3351d04..f469bd2, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits f469bd2..cf3bcf8, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo nuevo, sin manifiesto tocado, sin contrato entre módulos, sin datos persistentes) → no sale
Final: fixed falta test «sin --motivo» (Spec+Code, Important) — «cancelar sin --motivo» RED→GREEN (mutación: motivo por defecto), suite 7/7
Final: fixed test «sin reserva» perdido en f469bd2 (Spec+Code, Important) — «cancelar sin reserva con un motivo válido lo dice» RED→GREEN (mutación del mensaje), suite 7/7
Final: fixed test de canceladas dependía del orden (Code Important, Spec Minor) — «canceladas enseña sala, día y motivo» pasa solo (--test-name-pattern) y en suite, 7/7
Final: minor (deferred): canceladas sin canceladas imprime línea vacía (Spec y Code)
Final: minor (deferred): test de motivo inválido usa Sur mar en vez del GIVEN de la spec (Norte lun) (Spec)
Final: minor (deferred): estados 'active'/'cancelled'/'voided' como literales repetidos; voidBooking sin motivo; cancelledList en una línea larga (Code)
Final: Ruling: --motivo antes de la sala o sin sala/día — sale «sin reserva --motivo …»; la validación de argumentos de run ya faltaba antes y la spec fija la sintaxis — coste si falla: mensaje confuso en uso erróneo
Final: Ruling: mayúsculas distintas en el motivo se rechazan — la lista es cerrada por decisión 1 — coste si falla: un usuario reintenta con el texto exacto
Final: Ruling: anulaciones sin motivo y fuera de canceladas — fuera de alcance, es la 0011 — coste si falla: ninguno en esta feature
Final: Ruling: regla de 24 h de PRODUCT.md no implementada — ya faltaba antes y esta spec no la toca — coste si falla: cancelaciones tardías permitidas, como hasta ahora
Final: Ruling: motivos se pierden al cerrar el proceso — ADR 0003 (reservas en memoria), persistir es la 0014 — coste si falla: ninguno hasta la 0014
Final: Ruling: reservar --cada-semana y otro código fuera del diff — fuera del alcance de la rama — coste si falla: ninguno
Final: Ruling: configurabilidad de la lista de motivos — decisión de arquitectura, cerrada por la spec — coste si falla: cambiar la lista exige tocar código
Final: Ruling: test borrado «cancelar una reserva activa» — su aserción sin motivo contradice el nuevo THEN, sustituido por el test con motivo — coste si falla: ninguno
Final: nota para archivar: la spec numera decisiones 1 y 3 (falta la 2) y marca «Modificadas: bookings» con delta solo ADDED
Final: no verificado — rojo previo de los tests de las tasks: sin prueba en el ledger (solo «2/2» y «3/3 pass»); queda como sin verificar
