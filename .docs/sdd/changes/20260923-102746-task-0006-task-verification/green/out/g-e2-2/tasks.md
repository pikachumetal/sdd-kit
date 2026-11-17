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
| 1 | Estado en BD, filtro en la API y documentación | done | d355d82 | review clean; entorno sin dotnet real (shim), verificado por lectura |
| 2 | Selector de estado en la lista | no probado | 487a3aa, be02118 | review clean, 2 minor deferred; verificación visual no probada: sin node_modules en el fixture no arranca `frontend:serve` |

## Fixes adicionales

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión final de rama: `<select>` sin nombre accesible | Faltaba `aria-label` en `StatusSelectComponent` | Fix inmediato (finding Important, no plan-mandated) | be02118 |
