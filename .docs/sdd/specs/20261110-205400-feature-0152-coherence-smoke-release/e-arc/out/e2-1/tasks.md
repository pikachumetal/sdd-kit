---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7d7fc2e | |
| 2 | Listado de canceladas | done | 05b640f | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 05b640f
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (commit de la Task 1) y 1 Minor (ruling), corregidos en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Corregido en el cierre: no se aplicó** (el gate sigue siendo `node --test test/` y salió verde sin el flag; `node --test` ya corre cada fichero en su proceso), ver la deuda de la 0010
