# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 74a0f9d |
| 2 — Listado de canceladas | hecha | 368e92b |

Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre 368e92b
Pasada de fix: 3159e2e, 2 hallazgos RED→GREEN
Re-revisión: 368e92b..3159e2e, sdd-kit:effort-high + opus, listo para mergear

## Rulings

Final: Ruling: Eje Arquitectura sigue «no» pese al campo `reason` — es un campo del objeto en memoria (ADR 0003), sin módulo, dependencia ni contrato nuevos — si fuera erróneo, un eje sin pasar sobre un cambio de datos mínimo
Final: Ruling: spec con ADDED en vez de MODIFIED y numeración de decisiones 1→3 — la spec está aprobada; cambiarla es una enmienda, no se toca en este cierre — queda una etiqueta imprecisa en la spec archivada
Final: minor (deferred): test de canceladas depende del orden de los tests (estado compartido en memoria)
Final: minor (deferred): canceladas sin canceladas imprime línea vacía (la spec calla; cambiaría la salida observable)
Final: Ruling: CHANGELOG línea «Cancelar una reserva propia» — se actualiza en el cierre de sdd-archive — si no, el changelog queda sin el motivo
