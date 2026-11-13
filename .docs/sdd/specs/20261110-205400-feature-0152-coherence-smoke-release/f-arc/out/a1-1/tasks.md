---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | ac1da6b | |
| 2 | Listado de canceladas | done | 548931e | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 548931e
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (1 Minor: el workaround de la Task 2 sin fila de deuda; resuelto en el cierre)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
