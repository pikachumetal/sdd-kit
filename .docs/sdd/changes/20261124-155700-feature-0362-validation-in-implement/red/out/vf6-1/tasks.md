---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 950dde7 | |
| 2 | Listado de canceladas | done | 3017a76 | |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 55612c2
Pasada de fix: 5607939, 4 hallazgos con test (3 mutados en rojo; los de cobertura, verdes al escribirse)
Re-revisión: 55612c2..5607939, sdd-kit:effort-high + opus, limpia

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo, dependencia ni contrato nuevos; `reason` es un campo de la reserva en memoria) → no sale
- Final: fixed «sin --motivo» sin test — `cancelar sin --motivo` suite 9/9
- Final: fixed «sin reserva» sin cobertura — `cancelar sin reserva lo dice` suite 9/9
- Final: fixed `canceladas` dependía del test 1 — pasa sola con --test-name-pattern, suite 9/9
- Final: fixed `--motivo` sin valor sin test — `cancelar con --motivo sin valor` suite 9/9
- Final: Ruling: Spec #3, el delta etiqueta ADDED lo que modifica `cancelar` sin motivo — la aprobación ya cubre el comportamiento (la línea AND); es una etiqueta y no cambia lo aprobado, pero hay que enmendar la spec a MODIFIED y anunciarlo en el changelog al cierre — coste si es erróneo: la release notes no avisa del cambio incompatible
- Final: minor (deferred): `canceladas` sin canceladas devuelve cadena vacía
- Final: minor (deferred): `cancelar --motivo otro Norte lun` toma `--motivo` como sala
- Final: minor (deferred): el test de motivo inválido usa Sur mar, sin reserva
- Final: minor (deferred): `cancelledList` no exportada, inconsistente con los otros handlers
