---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7f9fa49 | commit corregido en el cierre: la fila decía 9f54946, que es el de la Task 2 |
| 2 | Listado de canceladas | done | 9f54946 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 9f54946

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 Important (solo en este fichero, corregidos o dictaminados en el cierre), sin hallazgos de código

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Cierre: el ruling no llegó a aplicarse. `gate.json` y el gate de la constitution no llevan `--test-concurrency=1`, y `node --test` ya corre cada fichero en su propio proceso, así que los ficheros no comparten almacén. Lo que sí hay es un acoplamiento de orden dentro de `test/cancel.test.js` (ver la deuda abierta en el roadmap).
