---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6770fb1 | commit corregido en el cierre: la fila decía 42fa1c4 |
| 2 | Listado de canceladas | done | 42fa1c4 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 42fa1c4
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 hallazgos (1 Important adjudicado, 1 Minor corregido)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Corrección del cierre: ningún gate ni `package.json` aplica esa opción, y el gate de cierre declarado (sin ella) pasó 5/5 en unitarios. No es una carrera: `canceladas enseña sala, día y motivo` falla ejecutado solo (`actual: ''`), porque depende de que antes corra `cancelar con un motivo de la lista`. Es una dependencia de orden.
- Final: Ruling: la dependencia de orden de ese test no se arregla en el cierre — es un cambio de código posterior a la revisión final y la spec no lo pide; queda como deuda en «Por triar» — coste si es erróneo: el test falla si alguien lo filtra o reordena, y `operations.md` («Datos») lo declara una dependencia entre tests
