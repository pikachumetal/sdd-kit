---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 8da7cd1 | |
| 2 | Listado de canceladas | done | c50627a | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre c50627a
Re-revisión: juntada en el cierre, opus+high, 2 hallazgos Important solo en este fichero (el commit de la Task 1 y el ruling), corregidos en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Cierre: el flag nunca llegó al repo (ni `package.json`, ni `operations.md`, ni el plan) y el cierre corrió el gate tal como lo declara `operations.md`, en verde. `node --test` ya aísla cada fichero en su subproceso, así que la carrera que el ruling esquivaba no es de ficheros: es que `canceladas enseña sala, día y motivo` solo pasa tras el primer test de `test/cancel.test.js`. Va a la deuda, no al gate.
