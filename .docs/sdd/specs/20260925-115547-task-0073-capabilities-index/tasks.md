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
| 1 | El propósito en la plantilla, el validador, las capacidades y la migración | done | 50eacb1 | 14 capacidades, no 13: `planning` llegó con la 0062 |
| 2 | `Get-CapabilityIndex.ps1` | done | 6e42727 | develop integrado antes (merge e689360, freno de alcance) |
| 3 | Las skills ejecutan el índice (RED → guía → GREEN) | done | 888f151 | RED 6 sujetos 2,13 $; GREEN 6 sujetos 1,99 $; migración 2 sujetos 0,59 $; campaña 14 sujetos, 4,70 $ |

## Verificación por task

- [x] Task 1 — `Invoke-Pester tests/Test-Capabilities.Tests.ps1,tests/MigrationInitParity.Tests.ps1,tests/CapabilityRules.Tests.ps1,tests/CapabilitiesAtBirth.Tests.ps1`
- [x] Task 2 — `Invoke-Pester tests/Get-CapabilityIndex.Tests.ps1,tests/Test-Capabilities.Tests.ps1`
- [x] Task 3 — `Invoke-Pester tests/CapabilityRules.Tests.ps1` y la campaña GREEN (lenta)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

Revisión final: sdd-kit:effort-high + opus, Con arreglos (0 críticos, 1 importante, 9 menores); el importante (paso de la migración sin campaña) se cubrió con una tanda de 2 sujetos, limpia; los menores, diferidos.
