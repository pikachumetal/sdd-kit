---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 42ffec1 | |
| 2 | Listado de canceladas | done | ad6e337 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre ad6e337
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (1 Minor: el `trim` sin test)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Ruling: la re-revisión deja un Minor, el `trim` de `reasonOf` (`src/app.js`) sin test que lo fije — se queda sin test: no cambia ningún escenario de la spec y los THEN pasan con ejecución real — coste si es erróneo: quitar el `?.trim()` no rompe ningún test
