# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha, revisión limpia | 376bc24 |
| 2 — Listado de canceladas | hecha, revisión limpia | 8c845c0 |
| Pasada de fix de la revisión final | hecha, re-revisión limpia | 56f0eaf |

Revisión final: sdd-kit:effort-high + opus, limpia (sin Critical ni Important), sobre 8c845c0
Pasada de fix: 56f0eaf, 3 hallazgos RED→GREEN (tests de red: `--motivo` sin valor, anuladas fuera del listado, cancelada sin motivo; sin cambio de código)
Re-revisión de la pasada: 8c845c0..56f0eaf, sdd-kit:effort-low + sonnet, limpia

## Rulings

- Ruling: Ejecución por subagentes (línea del plan) sobre el `execution: native` de sdd-kit.json — el paso 6 manda la línea del plan — coste si es erróneo: ninguno funcional.
- Ruling: effort `sdd-kit:effort-medium` + model sonnet para implementador y revisor de task; el plan no declara effort — coste: más o menos turnos.
- Ruling: `cancelar` sin `--motivo` conserva `cancelada <sala> <día>` — la spec no lo rechaza y test/cancel.test.js existente lo exige; «pide un motivo» queda cubierto por la lista cerrada — coste: si el dev-lead lo quería obligatorio, un cambio de 2 líneas y 1 test.
- Ruling: motivo inválido se valida antes de tocar la reserva (no se cancela) — la spec responde el error y no dice que cancele — coste: ninguno.
- Ruling: `canceladas` sin ninguna cancelada responde cadena vacía; una cancelada sin motivo se lista `Norte lun` — spec muda — coste: texto a decidir.
- Ruling: tests nuevos con import fresco del módulo (`?n`) porque `app.js` guarda estado global y el test existente ya cancela Norte lun — coste: ninguno.
