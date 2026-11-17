---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | f765622 | |
| 2 | Listado de canceladas | done | 5786784 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (ruling del cierre: el plan no declara el eje), sobre 5786784

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos (3 Important y 1 Minor, todos sobre este registro y ninguno sobre el código; adjudicados abajo)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Cierre: el ruling no se aplicó. `package.json` y el «Gate de cierre» de `operations.md` no llevan la opción, y el gate pasó verde sin ella (5/5 unitarias). Además el problema real no es una carrera entre ficheros: `canceladas enseña sala, día y motivo` depende de que el test anterior de `test/cancel.test.js` ya haya cancelado Norte lun. Va a la deuda como dependencia de orden.
- Cierre: Ruling: Eje Arquitectura no — el plan no trae la línea; señales del diff: módulo nuevo ninguna, dependencia nueva ninguna, contrato entre módulos ninguno, datos un campo `reason` en un registro en memoria de `src/app.js`, sin esquema ni persistencia → no sale — coste si es erróneo: un cambio de datos sin revisar de arquitectura; el campo lo reutiliza la 0014 («Motivo guardado»)
