---
id: 20260923-090000-task-0012-status-filter
title: Tasks — Filtrar la lista de reservas por estado
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — Filtrar la lista de reservas por estado (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0012`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Estado en BD, filtro en la API y documentación | done | b66f169 | revisión de task aprobada; `moon run backend:test` verde |
| 2 | Selector de estado en la lista | done | 33038f6 | revisión de task aprobada (Approved, 0 Critical/Important); `moon run frontend:check` y `moon run frontend:test` verdes |

## Fixes adicionales

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión final de rama: migración `AddBookingStatus` sin `[DbContext]`/`[Migration]`, EF Core no la descubriría | Task 1 no incluyó los atributos de discovery de EF Core al crear la migración | Ruling: fix directo, atributos estándar sin efecto en el resto del código | a493a5d |
