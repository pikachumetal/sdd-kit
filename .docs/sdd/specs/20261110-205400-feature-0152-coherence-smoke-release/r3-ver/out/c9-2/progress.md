# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 4b1c65d..df11ca5, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits df11ca5..e3b3c53, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo, dependencia, contrato ni datos nuevos) → no sale
Final: Spec opus+high Ready · Código sonnet+high With fixes, sobre e3b3c53
Final: Ruling: hallazgo Minor de Spec (listado sin tope) — re-graduado por efecto: sigue Minor, pero entra en la pasada con review.minors: fix; el número lo fija la decisión 4 del spec (20 últimas + «… y N más»), no el «10» sugerido por el revisor — el spec ya lo decidió con el dev-lead; el código no lo cumplía — coste si me equivoco: listado de más/menos líneas
Final: Ruling: «las 20 últimas» se toma en el orden del array de reservas (no se guarda la hora de cancelación) — coste si me equivoco: con más de 20, el corte puede no ser el de cancelación más reciente
Final: fixed reasonOf conserva espacios (Código, Important) — 'cancelar recorta los espacios del motivo' RED→GREEN, suite 7/7
Final: fixed cancelledList sin tope (Spec, Minor, minors: fix) — 'canceladas enseña las 20 últimas y cuenta las demás' RED→GREEN, suite 7/7 (commit 35c72d5)
Final: Ruling: re-revisión — «últimas» = orden del array, sin hora de cancelación guardada; sin enmienda en el spec — queda para el dev-lead (✋); coste si me equivoco: con >20 el corte puede no ser el más reciente
Final: Ruling: re-revisión — los dos tests nuevos dependen del orden (el «5» cuenta la cancelación del primero) — cada fichero de test corre en su proceso y el fichero se ejecuta entero; coste si me equivoco: fallo si se corre el segundo solo con --test-name-pattern
Final: Ruling: re-revisión — `bookings` exportado solo para el test y tests en `final-review.test.js` y no en `cancel.test.js` — no hay otra forma de sembrar reservas con la CLI actual; coste si me equivoco: estado interno expuesto, nombre de fichero poco descriptivo
