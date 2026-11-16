# Tasks — 0010 Motivo al cancelar

Nota: este fichero se escribió al cerrar la implementación, no antes de la Task 1. Las dos tasks se retomaron ya completas desde el ledger; no hay pre-flight scan, ni base check, ni copia de los RED tests registrados.

| Task | Estado | Commits |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | hecha | 0058c74..c538b67 |
| Task 2 — Listado de canceladas | hecha | c538b67..dcf46b9 |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura opus+high, con arreglos (subido: dependencia zod), sobre dcf46b9
Pasada de fix: 1aa4b80, 4 hallazgos (3 con RED por mutación del código, 1 verificado aislando el test), suite 7/7
Re-revisión: dcf46b9..1aa4b80, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas

## Rulings

- Eje Arquitectura no → sí — el diff añade la dependencia zod, que el plan no preveía — si me equivoco cuesta un review de opus de más
- Code/Spec — orden de argumentos raro (`cancelar --motivo otro Norte lun`) — la spec solo define `<sala> <día> --motivo <motivo>`; quien lo escribe así recibe «sin reserva …», un mensaje engañoso pero inocuo — cuesta un mensaje confuso en un uso fuera de la sintaxis
- Spec — validar el motivo antes de buscar la reserva — coherente con los dos AND de la spec — si me equivoco, una reserva inexistente con motivo inválido responde «motivo no válido» en vez de «sin reserva»
- Spec — --motivo sin comillas parte «sala ocupada» en dos argumentos — es el shell, la spec usa comillas — cuesta «motivo no válido» al omitirlas
- Arquitectura — el semilla `bookings` de app.js:4 va contra «cada arranque empieza vacío» del ADR 0003 — existía antes de esta feature y el diff no lo toca — cuesta deuda ajena a la 0010
- Arquitectura — `canceladas` no sobrevive entre ejecuciones de la CLI por el ADR 0003 (reservas en memoria) — la rama respeta el ADR aceptado; revisarlo es decisión del dev-lead, no de esta feature — cuesta que `canceladas` solo sirva dentro de un proceso
- Spec — CHANGELOG/README no entran en la 0010 — lo hace sdd-archive — cuesta nada si se hace al cerrar

## Minors aplazados

- `canceladas` sin cancelaciones imprime una línea vacía (src/app.js:35-37); mejor «sin canceladas»
- `cancelar --motivo otro Norte lun` toma `--motivo` como sala (src/app.js reasonOf/run); quitar el par antes de leer posicionales
- literales 'active'/'cancelled' repetidos y `cancelledList` lejos de los demás helpers (src/app.js)
- apuntar en debt.md «Por triar» que `canceladas` no persiste entre ejecuciones (ADR 0003)
