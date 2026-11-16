---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 5a1e773 | |
| 2 | Listado de canceladas | done | fbdd1cb | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre fbdd1cb

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (solo docs; 2 Minor sobre las ADR 0001 y 0002: la 0002 arreglada en el cierre, la 0001 en la deuda)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
