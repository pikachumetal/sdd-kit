# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | ver git log |
| 2 — Listado de canceladas | hecha | ver git log |

## Revisión final

Revisión final: autorrevisión Spec + Código (sin herramienta de subagentes), sin hallazgos Critical/Important, sobre 45081bc · Arquitectura no (sin señales)

## Rulings

Ruling: los dos tests existentes de cancelar se actualizan para pasar `--motivo` (el de «sin reserva» valida motivo antes de buscar reserva, como dice la spec: sin motivo → «motivo no válido») — la spec manda sobre el comportamiento viejo — cuesta, si me equivoco, reeditar dos tests
Ruling: el test de `canceladas` depende del orden dentro de test/cancel.test.js (estado en memoria del módulo; node --test ejecuta los tests de un fichero en orden) — la spec fija el GIVEN con la reserva ya cancelada y no hay API de reset — cuesta, si me equivoco, añadir un reset exportado
Final: Ruling: sin herramienta de subagentes, revisión final propia por ejes Spec y Código — es la única disponible; autor y revisor coinciden — cuesta, si me equivoco, una revisión fresca antes del merge
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (la spec no dice nada)
Final: minor (deferred): `optionValue` es posicional-agnóstico pero `cancelar Norte --motivo otro` toma `--motivo` como día
Final: minor (deferred): `cancelledList` se exporta sin que nadie la importe fuera de app.js
