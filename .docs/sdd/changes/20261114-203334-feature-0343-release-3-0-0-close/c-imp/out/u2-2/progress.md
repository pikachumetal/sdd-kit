# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 3: Ruling: el guardado de --por solo es observable por `canceladas` (Task 2); el test de la Task 3 (respuesta igual con --por) pasa al escribirlo y es guarda de regresión — el guardado del nombre se implementa en la Task 2, bajo su RED del listado con --por Ana — Cuesta: la Task 3 no lleva código de producción; si el listado no enseña el nombre, lo caza la Task 2
Task 3: complete (commits f6e03c1..4f06620, tests: node --test test/cancel.test.js → ℹ duration_ms 106.6268)
Task 2: complete (commits 4f06620..1008c0b, tests: node --test test/cancel.test.js → ℹ duration_ms 104.5277)
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: ninguna (sin módulo, dependencia ni contrato nuevos; `by` es un campo más de una reserva en memoria) → no sale. Ruling: Eje Arquitectura no — el plan no lo declara y el diff no cruza señales — Cuesta: un borde entre módulos sin mirar, improbable en un fichero
Final: fixed Important «sin reserva sin test» — cancelar con motivo válido sobre sala sin reserva RED→GREEN por mutación, suite 9/9
Final: fixed Important «cancelar sin --motivo sin test» — cancelar sin --motivo RED→GREEN por mutación, suite 9/9
Final: minor (deferred): optionOf toma como valor el token siguiente aunque sea otra opción (--motivo --por Ana)
Final: minor (deferred): imports con query string repetidos en los tests; extraer un helper freshApp
Final: minor (deferred): el nombre «responde igual que sin él» compara con un literal, no con la respuesta sin --por
Final: minor (deferred): la línea de cancelar en run supera 120 caracteres
Final: minor (deferred): canceladas sin ninguna devuelve cadena vacía; texto «sin canceladas» sin confirmar con el dev-lead (la spec no lo recoge)
Final: Ruling: declined — las reservas viven en memoria y no persisten entre ejecuciones de la shell — ya era así (anular igual), la spec prueba por run() — Cuesta: desde la terminal, cancelar y luego canceladas muestra el listado vacío; conviene plantearlo al dev-lead como feature aparte
Final: Ruling: declined — orden de validaciones (motivo antes que reserva inexistente) — la spec no lo fija y ambas son razonables — Cuesta: mensaje menos preciso si ambas fallan
Final: re-revisión f258593..04e68fd Approved
