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
| 1 | Estado en BD, filtro en la API y documentación | done | 2b762b0, b129f09 | review clean tras 1 ronda de fix (JsonConverter de texto) |
| 2 | Selector de estado en la lista | done | 54344e0 | review clean, minor aparcado (aria-label) |

## Fixes adicionales

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Task 1: `status` serializaba como número en JSON | `BookingStatus` sin `JsonConverter` de texto; `System.Text.Json` serializa enums por defecto como su valor numérico | Ruling en fix round 1: añadir `[JsonConverter(typeof(JsonStringEnumConverter))]` | b129f09 |
