---
id: 20260925-115547-task-0073-capabilities-index
title: Tasks — Índice de capacidades generado
spec: ./spec.md
plan: ./plan.md
created: 2026-09-25
---

# Tasks — Índice de capacidades generado (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0073-capabilities-index`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El propósito en la plantilla, el validador, las capacidades y la migración | pending | — | |
| 2 | `Get-CapabilityIndex.ps1` | pending | — | |
| 3 | Las skills ejecutan el índice (RED → guía → GREEN) | pending | — | RED hecho con la apertura: 6 sujetos, 2,13 $ |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester tests/Test-Capabilities.Tests.ps1,tests/MigrationInitParity.Tests.ps1,tests/CapabilityRules.Tests.ps1,tests/CapabilitiesAtBirth.Tests.ps1`
- [ ] Task 2 — `Invoke-Pester tests/Get-CapabilityIndex.Tests.ps1,tests/Test-Capabilities.Tests.ps1`
- [ ] Task 3 — `Invoke-Pester tests/CapabilityRules.Tests.ps1` y la campaña GREEN (lenta)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
