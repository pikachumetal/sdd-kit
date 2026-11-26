---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 52883f7 | |
| 2 | Listado de canceladas | done | d449da0 | |
| 3 | Revisión final: `canceladas` vacía sin línea en blanco | done | ce39c04 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important: `canceladas` con la lista vacía imprime una línea en blanco, sobre e959b28

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: con la lista vacía `canceladas` no imprime nada — el spec no fija el texto y no invento uno — coste si es erróneo: el dev-lead querrá un mensaje tipo «sin canceladas» y será un cambio de una línea
