# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commits |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 75d0805..058d2d8 |
| 2 — Listado de canceladas | hecha | 058d2d8..80a0e5f |

Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre 80a0e5f
Pasada de fix: 8a2f198, 4 hallazgos RED→GREEN
Re-revisión: 80a0e5f..8a2f198, sdd-kit:effort-high + opus, 5 de 6 resueltos, 1 a medias (adjudicado)

## Rulings

Final: Ruling: canceladas sin canceladas devuelve cadena vacía, sin mensaje (Code I3, Spec M5) — decir «sin canceladas» añade un THEN que la spec no tiene: sería una desviación y se cambia con el dev-lead, no en el fix — si hay error, el usuario ve una línea en blanco
Final: Ruling: declined (Spec) 24 h de PRODUCT.md — fuera del scope de la 0010 — coste: una regla de negocio sin implementar, ya fuera de esta spec
Final: Ruling: declined (Spec) formas alternativas --motivo=otro / motivo sin comillas / orden de argumentos — la spec fija solo `cancelar <sala> <día> --motivo <motivo>` — coste: el usuario recibe «motivo no válido» con otra forma
Final: Ruling: declined (Spec) coincidencia sin distinguir mayúsculas — la lista es cerrada (decisión 1) — coste: «Sala ocupada» se rechaza
Final: Ruling: declined (Spec, Code) anulaciones del responsable (0011) y persistencia (ADR 0003) y estado de módulo — fuera de scope / ADR aceptada — coste: ninguno en esta feature
Final: Ruling: declined (Spec) orden de las comprobaciones (motivo inválido antes que «sin reserva») — lo exige el caso de la spec — coste: motivo inválido sobre sala sin reserva da el error de motivo
Final: Ruling: declined (Spec) decisión 3 «sin review de spec» — decisión de proceso, sin regla de código — coste: ninguno
Final: Ruling: no verificado (Spec) si el test borrado era el de regresión del patch 0007 — su cobertura está recuperada con el test nuevo — coste: ninguno
Final: Ruling: el test de canceladas solo cubre un motivo guardado (Code I, mitad abierta de la re-revisión) — la spec fija un único THEN («Norte lun — sala ocupada») y el código lee b.reason; una pasada más de fix no se abre tras la re-revisión — si hay error, un cancelledList con el motivo fijo pasaría la suite
Final: Ruling: diff de test/cancel.test.js reescribe el fichero entero (posible cambio de saltos de línea CRLF al comitear) — las aserciones previas son idénticas; solo ruido de blame — coste: historial menos legible
Final: Ruling: «no cancela la reserva» se comprueba por ausencia en canceladas, no por estado (Re-revisión, Minor) — la spec solo exige el mensaje — coste: un estado distinto de 'cancelled' pasaría

## Minors diferidos

Final: minor (deferred): `--motivo` ausente y motivo inválido comparten mensaje (lo pide la spec) y falta mensaje distinto — Code M1
Final: minor (deferred): literales de estado 'active'/'cancelled'/'voided' repetidos (ya existía) — Code M2
Final: minor (deferred): cancelledList mezcla filtro y formato en una línea larga — Code M3
