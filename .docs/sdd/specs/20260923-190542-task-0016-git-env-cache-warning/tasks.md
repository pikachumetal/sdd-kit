---
id: 20260923-190542-task-0016-git-env-cache-warning
title: Tasks — Entorno de git limpio en los tests y aviso de skills cargadas de la caché
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — Entorno de git limpio en los tests y aviso de skills cargadas de la caché (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0016`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Helper `Clear-GitEnv.ps1` y migración de los tests | pending | — | |
| 2 | Hook `SessionStart` del repo | pending | — | |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester -Path tests/Clear-GitEnv.Tests.ps1,tests/GitEnvConvention.Tests.ps1,tests/PathLength.Tests.ps1,tests/Hook.Tests.ps1`; lenta: `Get-NextSddId.Tests.ps1`, `Invoke-SddMerge.Tests.ps1`
- [ ] Task 2 — `Invoke-Pester -Path tests/KitSessionSource.Tests.ps1,tests/GitEnvConvention.Tests.ps1`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
