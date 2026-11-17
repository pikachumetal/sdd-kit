---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 82c4b3a | |
| 2 | Listado de canceladas | done | 28d9297 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 28d9297
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (architecture.md: Node 22→20 sin justificación; revertido en el cierre) y 1 Minor (workaround del ruling sin fila de deuda; añadida)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
