# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 77829d5..5d01966, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 5d01966..3903ea0, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo nuevo, sin dependencia: package.json sin cambios, sin contrato entre módulos ni cambio de datos persistentes; solo src/app.js) → no sale
Final: fixed cancelar sin motivo sin test (Spec Important 1) — test 'cancelar sin motivo pide uno de la lista' (la conducta ya existía: sin RED posible), suite 7/7
Final: fixed test borrado 'cancelar sin reserva lo dice' (Spec Important 2 / Code Important 1) — restaurado con --motivo, suite 7/7
Final: fixed test de canceladas acoplado al orden (Code Important 2 / Spec Minor 4) — cancela él mismo antes de listar; pasa solo con --test-name-pattern, suite 7/7
Final: minor (deferred): canceladas vacío imprime una línea en blanco (src/app.js:57)
Final: minor (deferred): --motivo seguido de otra opción toma esa opción como motivo (src/app.js:34)
Final: minor (deferred): run crece como cadena de if (src/app.js:63)
Final: minor (deferred): raya no ASCII como separador del listado (src/app.js:57)
Final: Ruling: declined to judge (Spec) — mayúsculas/espacios en el motivo, motivo sin comillas, orden de argumentos, sin reserva y sin motivo → motivo no válido, recancelar → sin reserva: la lista es cerrada y literal, el resto es heredado o de la shell — coste si falla: un mensaje de error menos preciso
Final: Ruling: declined to judge (Code) — ADR 0003, anular sin motivo, modo Native, duración de la suite: fuera del eje o ya decididos — coste si falla: ninguno en el código
Final: Ruling: no verificado (Spec) salida real por terminal en Windows (comillas, raya, tildes) — se comprueba en la validación del cierre — coste si falla: texto mal codificado en consola
Final: Ruling: re-revisión, minors nuevos (test:23 no comprueba el retorno del GIVEN; test:13-16 usa Sur mar) y observación fuera de alcance (estado de módulo compartido, ADR 0003) — no bloquean — coste si falla: un mensaje de fallo confuso si cambia un motivo
