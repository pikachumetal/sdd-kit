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
| 2 | Listado de canceladas | done | d88526b | enmienda 1: `--por` |

## Rulings

- Task 2: la enmienda 1 obliga a retocar `cancelar` y los tests de la Task 1 (`--por` obligatorio); entran en el commit d88526b, no en una task nueva.
- Task 2: el aviso `falta quién cancela` se comprueba después del motivo, así que un motivo inválido sin `--por` sigue dando el error de motivo.
