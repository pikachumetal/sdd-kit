# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar pide un motivo | hecha | ver git log |
| 2 — Listado de canceladas | hecha | ver git log |

Revisión final: Spec opus+high, With fixes (1 Minor→Important, arreglado) · Código sonnet+high, With fixes (3 Minor diferidos) · Arquitectura no (plan), sobre 49f3b1c
Pasada de fix: 45b7ab9, 1 hallazgo RED→GREEN
Re-revisión: 49f3b1c..45b7ab9, sdd-kit:effort-high + opus, Ready to merge

## Rulings

- Task 0: Ruling: tests de la 0010 comparten estado en memoria de `bookings` — se ordenan en el fichero (sin canceladas primero; rechazos antes de la cancelación efectiva de Norte lun) — coste si falla: reordenar tests
- Task 1: Ruling: el test 'un motivo inválido no cancela' no cancela después con 'otro' (el plan lo decía): lo prueba el test 'cancelar una reserva activa', que va después y exige que Norte lun siga activa — coste si falla: reordenar
- Final: minor (deferred): parseo de --motivo con indexOf(...)+1 lee params[0] cuando falta la opción y falla con otro orden de argumentos (src/app.js:61)
- Final: minor (deferred): tests de cancel.test.js dependen del orden por el estado compartido de bookings
- Final: minor (deferred): 'no cancela' se prueba solo por el mensaje y por el test posterior que cancela con éxito
- Final: minor (deferred): GIVEN del test del listado lo pone el test anterior (cancel.test.js:27)
- Final: minor (deferred): sin --motivo el motivo es params[0] en vez de undefined (src/app.js:38); sin efecto observable hoy
