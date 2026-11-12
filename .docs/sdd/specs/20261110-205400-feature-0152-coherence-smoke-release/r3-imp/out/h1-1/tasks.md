# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 80e5029 |
| 2 — Listado de canceladas | hecha | 5a4d427 |

Revisión final: autorrevisión del hilo (sin herramienta de subagentes); Eje Arquitectura no (sin señales en el diff). `node --test` → 7/7.

## Rulings

- Task 1: el test existente «cancelar una reserva activa» pasa a usar --motivo — la spec manda que sin motivo responda error — si me equivoco, un test pierde cobertura del caso sin motivo (queda cubierto por el nuevo).
- Task 1: reserva inexistente se comprueba antes que el motivo — la spec solo define el motivo para la reserva de Norte lun y el test existente exige «sin reserva Sur mar» sin motivo — si me equivoco, cancelar sin reserva ni motivo responde otra frase.
- Task 1: los tests de rechazo van antes del de éxito en test/cancel.test.js — el estado de reservas es del módulo y el éxito consume Norte lun — si me equivoco, un reordenamiento de tests rompe los rechazos.

## Deferred minors

- `cancelar` lee el motivo con indexOf('--motivo'); si el flag va antes de sala/día, params[0] y params[1] no son sala y día — fuera del contrato de la spec.
