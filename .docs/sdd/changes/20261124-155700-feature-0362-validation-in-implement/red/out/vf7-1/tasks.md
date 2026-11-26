---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 922e630 | |
| 2 | Listado de canceladas | done | 5944965 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important: `canceladas` con la lista vacía imprime una línea en blanco, sobre cceb9c6
Pasada de fix: c2784d4, 1 hallazgos RED→GREEN
Re-revisión: cceb9c6..c2784d4, sdd-kit:effort-high + opus, limpia

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## Ledger final

- Final: fixed canceladas con la lista vacía imprime una línea en blanco — canceladas sin ninguna cancelada no deja una línea en blanco RED→GREEN, suite 6/6
- Final: Ruling: la spec no dice qué responde `canceladas` sin canceladas; respondo «sin canceladas» en vez de silencio o línea en blanco — quien lo usa ve que la lista está vacía y no un comando roto — coste si es erróneo: cambiar un literal y un test
