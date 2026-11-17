# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar pide un motivo de la lista | hecha | 134852c |
| 2 — Listado de canceladas con su motivo | hecha | 733edc5 |

Revisión final: Spec opus+high, 1 Important (arreglado) + 3 Minor · Código sonnet+high, sin Critical ni Important, 5 Minor diferidos · Arquitectura no (plan), sobre 733edc5
Pasada de fix: 0055a49, 2 hallazgos RED→GREEN (comprobado por mutación)
Re-revisión: 733edc5..0055a49, sdd-kit:effort-high + opus, 3 de 4 hallazgos ADDRESSED, 1 Minor adjudicado (ruling)

## Rulings

Task 1: Ruling: los tests comparten estado en memoria (una sola reserva sembrada, Norte lun) — ordené los tests de Task 1 con los rechazos primero y la cancelación válida después; `motivo_invalido_no_cancela` repite el rechazo y comprueba que la respuesta sigue siendo «motivo no válido» y no «sin reserva» (la reserva sigue activa) — coste si me equivoco: reordenar tests.
Final: minor (deferred): los tests de test/cancel.test.js dependen del orden por el estado compartido (ya ruled en Task 1)
Final: minor (deferred): motivo_invalido_no_cancela repite la llamada de `motivo fuera de la lista`; la intención no es evidente
Final: minor (deferred): nombres de test mezclan snake_case y frases
Final: minor (deferred): REASONS en mayúsculas junto a rooms/bookings en minúsculas
Final: minor (deferred): canceladas-vacio.test.js no dice por qué es un fichero aparte
Final: Ruling: corregido el ruling de Task 1 sobre el orden: los tests que consumen Norte lun van en ficheros propios; en cancel.test.js solo queda la dependencia «motivo fuera de la lista» antes de «cancelar una reserva activa» — coste si me equivoco: un test que falla de forma confusa si se reordena
Final: Ruling: re-revisión, hallazgo 4 (Minor, duplicación de `motivo fuera de la lista` con el primer assert de `motivo_invalido_no_cancela` y el literal del rechazo en tres ficheros) — se queda: `motivo fuera de la lista` es el escenario literal de la spec («AND un motivo fuera de la lista responde…») y su test nombrado en «Dónde se prueba» (`test/cancel.test.js`); los ficheros aislados repiten el literal porque cada uno es un proceso aparte — coste si me equivoco: una línea repetida en tests
