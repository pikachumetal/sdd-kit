---
id: 20260923-203736-task-0039-moving-base
title: Tasks — La base se mueve antes del cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — La base se mueve antes del cierre (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0039`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El merge de sincronización en el cierre | done | 0555b2b | review limpia |
| 2 | El cruce de ficheros antes de cada despacho | done | 8449cff | review limpia; 1 Minor diferido |
| 3 | GREEN | done | 6f175c1 | en línea; 10/10, 3,13 $ |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/SyncMerge.Tests.ps1, tests/Skills.Tests.ps1, tests/CommitMilestones.Tests.ps1`
- [x] Task 2 — `Invoke-Pester -Path tests/FileOverlap.Tests.ps1, tests/ScopeBrake.Tests.ps1, tests/Skills.Tests.ps1`
- [x] Task 3 — veredictos leídos en `green/out/`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
