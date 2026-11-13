---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 8ae2ccb | |
| 2 | Listado de canceladas | done | 8ae2ccb | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 8ae2ccb

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (al cierre: la bandera no está en `gate.json`, que corre como está declarado; la carrera pasó a deuda)
