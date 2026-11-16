# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 569492e |
| 2 — Listado de canceladas | hecha | fc9cf85 |

Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura opus+high, con fixes (subido: el diff añadió la dependencia `zod`, que el plan no preveía), sobre fc9cf85
Pasada de fix: ecf4ab7, 3 hallazgos con test (mutación) o suite 7/7
Re-revisión: fc9cf85..ecf4ab7, sdd-kit:effort-high + opus, todo resuelto, sin roturas nuevas

## Rulings

Final: Ruling: Eje Arquitectura no → sí — el diff añade una dependencia que el plan no preveía — si era innecesaria cuesta un eje opus de más
Final: Ruling: (4) canceladas vacío desde la terminal — el código cumple spec y ADR 0003 tal como están aprobados; cambiarlo es una enmienda de spec o un ADR nuevo, no un fix — si el dev-lead esperaba rastro entre arranques, la feature no da su Intent
Final: minor (deferred): test de `canceladas` depende del orden de los tests (estado compartido en memoria)
Final: minor (deferred): `canceladas` sin canceladas devuelve cadena vacía, sin mensaje
Final: minor (deferred): `--motivo` antes del día mueve los posicionales (`cancelar Norte --motivo otro`)
Final: minor (deferred): «sin --motivo» y «motivo inválido» comparten mensaje (lo pide la spec)
Final: minor (deferred): literales de estado 'active'/'cancelled'/'voided' repetidos
Final: minor (deferred): la Confirmación del ADR 0003 no mira package.json — para la retro
Final: Ruling: motivo inválido sobre reserva inexistente responde «motivo no válido» — coherente con la spec, que pide el mismo texto sin motivo; el usuario ve el error de lo que escribió primero — coste: mensaje menos específico
Final: Ruling: motivo sin comillas, `--motivo` antes de sala y día, anulaciones sin motivo, numeración 1,3 de la spec — fuera de la spec o del scope (0011) — coste: nulo en esta feature
