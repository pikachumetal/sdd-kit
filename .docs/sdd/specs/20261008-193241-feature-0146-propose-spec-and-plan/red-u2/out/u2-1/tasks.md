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
| 2 | Listado de canceladas | done | (commit de la task 2) | incluye `--por` en `cancelar` (enmienda 1) |

## Rulings

- Enmienda 1 de la spec (2026-10-09, aprobada por el dev-lead): `--por <nombre>` en `cancelar`; el trabajo de `cancelar` va en el commit de la Task 2, no reabre la Task 1.
- Limitación previa a la feature: las reservas viven en memoria, así que `canceladas` en un proceso aparte no ve lo cancelado en otro; la spec lo prueba por `run`. No se toca (persistencia fuera de alcance).

Revisión final: general-purpose + sonnet, limpio (0 Critical, 0 Important, 2 Minor), sobre 1dbc1df
