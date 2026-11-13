# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 91b6575 |
| 2 — Listado de canceladas | hecha | f4b3c80 |

## Rulings

Revisión final: Spec self-review, sin hallazgos · Código self-review, sin hallazgos · Arquitectura no (sin línea en el plan), sobre f4b3c80

Ruling: los dos tests existentes de cancelar de test/cancel.test.js se actualizan para pasar --motivo — la spec fija que sin --motivo responde «motivo no válido…», y la validación va antes que buscar la reserva (el THEN lo exige incluso sin reserva) — si me equivoco, 'cancelar sin reserva' debería dar 'sin reserva' antes que el error de motivo
Ruling: sin remoto; base comparada con develop local, sin cambios en ROADMAP.md ni ficheros — nada que cruzar
Ruling: effort — el tipo sdd-kit:effort-<level> no lo expongo en este harness; hereda el de la sesión (Native, revisión final en el hilo si no hay subagentes)
Final: minor (deferred): `canceladas` sin ninguna cancelada imprime una línea vacía (la spec no dice nada)
Final: minor (deferred): el test de `canceladas` depende del estado compartido del módulo (lo cubre con un comentario y repitiendo la cancelación)
Final: Ruling: la reserva solo vive en memoria, así que por CLI `canceladas` en otro proceso no ve las cancelaciones — es el almacén que ya existía y la spec no pide persistencia — si me equivoco, el listado por CLI sale siempre vacío y haría falta una feature de persistencia
