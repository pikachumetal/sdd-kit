---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0a35c5f | |
| 2 | Listado de canceladas | done | eaccda1 | |
| 3 | engines.node en package.json (pedido del dev en la validación, paso 1) | done | 5b8436e, 57521fd | RED→GREEN: package.json declara la versión de Node; gate sin filtro 8/8 + 1/1 |



Revisión final: Spec opus+high, con fixes (2 importantes, 3 minors) · Código sonnet+high, con fixes (2 importantes) · Arquitectura no (ledger), sobre ab336e2
Pasada de fix: b19e9da, 3 hallazgos RED→GREEN
Re-revisión: ab336e2..b19e9da, sdd-kit:effort-high + opus, 2 resueltos · 1 resto abierto (adjudicado)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Eje Arquitectura: el plan no lo declara · señales en el diff: ninguna (sin módulo nuevo, sin dependencia — `package.json` intacto —, sin contrato entre módulos; `reason` es un campo más de la reserva en memoria, sin esquema ni persistencia) → no sale
- Final: fixed falta el test del THEN «sin --motivo» — cancelar sin --motivo RED→GREEN (mutación: motivo por defecto «otro»), suite 7/7
- Final: fixed se perdió el test «cancelar sin reserva lo dice» — cancelar sin reserva con un motivo válido lo dice RED→GREEN (mutación: mensaje distinto), suite 7/7
- Final: fixed test de canceladas dependía del orden — canceladas enseña sala, día y motivo ahora prepara su cancelación; solo con --test-name-pattern: 1/1 (antes 0/1), suite 7/7
- Final: Ruling: revocado el Ruling de la Task 2 (test de canceladas dependiente del orden) — el arreglo costaba una línea y está hecho — coste si es erróneo: ninguno
- Final: Ruling: un motivo no válido no cancela una reserva existente, sin test propio — el test de motivo fuera de la lista ya prueba que el motivo se valida antes que la reserva y el estado se muta solo tras ambas comprobaciones — coste si es erróneo: un cambio de orden en cancelBooking podría cancelar con un motivo inválido sin que ningún test lo vea
- Final: minor (deferred): canceladas sin canceladas imprime una línea vacía; hace falta acordar el literal con el dev-lead
- Final: minor (deferred): solo «sala ocupada» se prueba como motivo aceptado; un test con los tres motivos cubriría erratas en la lista
- Final: minor (deferred): literales de estado repetidos ('cancelled', 'active', 'voided') y --motivo solo admitido tras sala y día; ambos vienen de antes de la feature
- Final: Ruling: test de canceladas, resto abierto de la re-revisión — la línea de preparación hace que pase solo y reordenado; en la suite completa sigue dependiendo de que el test 1 deje cancelada Norte lun con «sala ocupada» (si el test 1 cambia de motivo, el de canceladas falla) — aislarlo pide un reset en src/app.js o un módulo nuevo por test, fuera del plan, y la 0014 mueve las reservas a persistencia — coste si es erróneo: un cambio de datos en el test 1 pone rojo el de canceladas, y el fallo se ve en el momento
- Final: Task 3 (validación): revisión de su diff, sdd-kit:effort-high + sonnet, sobre 5b8436e: sin Critical ni Important; 1 minor arreglado (finales de línea CRLF cambiados por mi edición, restaurados en 57521fd, revisado en el hilo: 57521fd · package.json, test/app.test.js · 0 líneas de más) · 1 minor (deferred): el test de engines compara «>=22» exacto
