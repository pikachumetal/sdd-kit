---
id: 20260929-160116-feature-0109-pending-migration-notice
title: Tasks — Aviso de migraciones pendientes al arrancar
spec: ./spec.md
plan: ./plan.md
created: 2026-09-29
---

# Tasks — Aviso de migraciones pendientes al arrancar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0109-pending-migration-notice`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cada release lleva su migración | done | 6bdba368 | RED 0,23 $ · GREEN 0,14 $ |
| 2 | Aviso de migraciones pendientes en el hook | done | 51d33c2b | GREEN headless 0,03 $ |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/MigrationInitParity.Tests.ps1` + sujetos RED/GREEN `m1`
- [x] Task 2 — `Invoke-Pester -Path tests/Hook.Tests.ps1` + sujeto GREEN del hook

Revisión final: sdd-kit:effort-high + opus, With fixes (0 Critical, 0 Important, 5 Minor; el Minor 1 re-graduado a Important), sobre 51d33c2b
Pasada de fix: juntada en el cierre, 1 hallazgos RED→GREEN

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
