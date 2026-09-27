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
| 1 | Estado en BD, filtro en la API y documentación | done | a68368c | revisión de task aprobada; `moon run backend:test` verde |
| 2 | Selector de estado en la lista | done | 78bbafc | revisión de task aprobada sin hallazgos; `moon run frontend:test` y `moon run frontend:check` verdes; verificación visual **no probado** — sin `package.json`/`node_modules` en este worktree no hay dev server real que abrir en navegador |

## Fixes adicionales

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
