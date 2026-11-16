---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6926078 | Commit corregido en el cierre (la tabla citaba cd95728, que es la Task 2) |
| 2 | Listado de canceladas | done | cd95728 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre cd95728
Re-revisión: cd95728..cierre, sdd-kit:effort-high + opus, 1 Important (commit de la Task 1 en esta tabla) corregido en el cierre · 1 Minor (el flag del ruling) al walkthrough

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Desmentido en el cierre:** `node --test` pasa 5/5 sin el flag; no hace falta (ver walkthrough §3)
