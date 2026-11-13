# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | commit en git log |
| 2 — Listado de canceladas | hecha | commit en git log |

## Rulings

Task 1: Ruling: actualizo 'cancelar una reserva activa' a la salida de la spec (con motivo) — la spec manda — coste si falla: un test viejo reescrito
Task 1: Ruling: la comprobación «sin reserva» va antes que la del motivo — la spec no dice el orden y cambiarlo cambiaría salida observable ya existente (test 'sin reserva' intacto) — coste: `cancelar Sur mar` sin motivo dice «sin reserva», no «motivo no válido»
Task 2: Ruling: `canceladas` solo lista status 'cancelled' (no 'voided', anulaciones son de 0011) — Scope «No entra» — coste: ninguno
Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF al reescribirlo (diff de fichero entero, sin cambio de comportamiento)

Revisión final: auto-revisión por ejes Spec y Código sin subagentes (no hay herramienta en el harness); Arquitectura no (plan), sin hallazgos Critical/Important, 1 Minor diferido, sobre 9a31dc3
