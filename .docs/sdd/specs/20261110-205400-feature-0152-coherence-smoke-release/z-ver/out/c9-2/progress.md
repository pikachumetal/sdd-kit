# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 0133acb..b5f37e2, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits b5f37e2..3e49b98, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo ni dependencia nuevos) → no sale
Final: fixed Important reasonOf conserva los espacios (src/app.js:14-17) — «cancelar recorta los espacios del motivo» RED→GREEN, suite 8/8
Final: fixed Minor canceladas sin tope (src/app.js:35-37) — «canceladas enseña las 20 últimas y cuenta el resto» RED→GREEN, suite 8/8
Final: Ruling: el tope del Minor era «por ejemplo 10»; aplico 20 con la línea «… y N más» porque la decisión 4 de la spec, validada con el dev-lead, ya lo fija — el código no lo cumplía — sin cambio de spec — coste si me equivoco: una línea de constante
Final: Ruling: exporto `cancelledList(all = bookings)` para probar el tope sin añadir un comando que cree reservas — la API pública del comando no cambia — coste si me equivoco: un export de más
Final: Ruling: re-revisión Minor — «las 20 últimas» sigue el orden de creación, no el de cancelación — hoy hay una sola reserva y ningún comando crea reservas, no se puede dar — coste si me equivoco: cuando se puedan crear reservas, una antigua cancelada tarde puede quedar fuera de las 20
Final: Ruling: re-revisión Minor — el test del recorte comprueba «sin reserva» y no el texto de confirmación recortado — no queda reserva activa en los datos de partida para cancelar por `run` — coste si me equivoco: una regresión del texto recortado no la vería este test
