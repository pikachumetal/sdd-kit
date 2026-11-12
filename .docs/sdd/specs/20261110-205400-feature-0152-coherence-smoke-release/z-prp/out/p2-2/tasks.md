# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar pide un motivo de la lista | hecha | ver git log |
| 2 — El listado de canceladas enseña el motivo | hecha | ver git log |

Revisión final: Spec opus+high, con arreglos (1 Important) · Código sonnet+high, Yes · Arquitectura no (plan), sobre 530b78c
Pasada de fix: 16cf34e, 1 hallazgo RED→GREEN (por mutación del filtro)
Re-revisión: 530b78c..16cf34e, sdd-kit:effort-high + opus, Yes (1 Minor de trazabilidad del plan, arreglado en el hilo)

## Rulings

Ruling: los tests que no cancelan (Rejects_*, Lists_none_when_no_cancelled) van antes en el fichero que el que cancela Norte lun, porque las reservas viven en memoria compartida por el fichero — sin export de reset (YAGNI) — si cambia el orden, fallan.
Final: minor (deferred): src/app.js: sin --motivo se lee params[0] (la sala) como motivo; sin efecto observable hoy (Spec 3, Código 1)
Final: minor (deferred): el test del listado no monta su propio GIVEN y depende del orden (Spec 2, Código 2)
Final: minor (deferred): falta test de motivo no válido sobre reserva inexistente (Spec 4); canceladas con varias entradas (Código 4); nombres de tests mezclados (Código 3)
Final: Ruling: declined — --motivo sala ocupada sin comillas llega como «sala» y se rechaza mostrando la lista válida; es lo que espera una persona — coste si falla: un rechazo con instrucciones
Final: Ruling: declined — recancelar una reserva cancelada responde «sin reserva…», como hoy; la spec no lo cambia — coste: texto algo ambiguo
Final: Ruling: declined — anular sobre cancelada, listado de anulaciones, persistencia entre ejecuciones y orden multilínea de canceladas son de la 0011 o la spec no los pide — coste: ninguno en esta feature
