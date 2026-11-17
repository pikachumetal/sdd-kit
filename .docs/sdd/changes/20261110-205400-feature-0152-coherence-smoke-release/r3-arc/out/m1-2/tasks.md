---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 9db7a16 | Commit corregido en el cierre: la fila decía f91cd20, que es el de la Task 2 |
| 2 | Listado de canceladas | done | f91cd20 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre f91cd20
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 Important (fila de la Task 1 con el commit equivocado, corregida; ruling `--test-concurrency=1` sin respaldo, a deuda) y 1 Minor (THEN «sin `--motivo`» sin test, a deuda)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble — **desmentido en el cierre**: `node --test` a secas, el gate de la constitución, dio 5/5 en 3 de 3 pasadas sin carrera reproducible; el dev-lead decide si se quita (deuda por triar)
