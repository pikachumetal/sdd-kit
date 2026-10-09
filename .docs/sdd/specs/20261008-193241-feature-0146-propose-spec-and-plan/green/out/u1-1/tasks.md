---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | (commit de la task 1) | |
| 2 | Listado de canceladas | done | f1b1108, 9135cde | Enmienda aprobada: c836cec (sin «quién canceló») |

## Rulings

- Task 2: el commit f1b1108 salió con un fallo de sintaxis (separador de líneas mal escapado) porque encadené el commit sin mirar el resultado de la suite; lo arregla 9135cde y `sdd task done` se lanzó ya en verde.
