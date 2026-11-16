---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3564c16 | Commit corregido en el cierre: la fila decía 8d64841, que es el de la Task 2 |
| 2 | Listado de canceladas | done | 8d64841 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 8d64841
Re-revisión: 8d64841..juntada en el cierre, sdd-kit:effort-high + opus, 1 Important y 1 Minor (el ruling de la Task 2 y el commit de la Task 1), ambos resueltos en el cierre sin tocar código

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Corrección en el cierre (re-revisión): el gate de cierre es `node --test` (plan y constitución). Corrido sin la bandera, pasa 5/5, y `node --test` ya corre cada fichero en su proceso, así que la bandera no arregla ninguna carrera entre ficheros: no la he usado. Queda la fragilidad real, anotada como deuda en el roadmap: el test «canceladas» de `test/cancel.test.js` depende de que el primer test haya cancelado antes.
