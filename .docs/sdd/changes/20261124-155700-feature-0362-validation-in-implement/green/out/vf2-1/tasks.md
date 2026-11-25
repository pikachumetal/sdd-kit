---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 1367714 | |
| 2 | Listado de canceladas | done | 475a056 | |
| 3 | Cancelar libera la sala en libres (fallo del paso 3 del script) | done | 05ddee3 | revierte ec86a99, que no estaba en el plan |



## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
