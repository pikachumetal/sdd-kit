---
id: 20260928-210002-feature-0098-visual-patch-lane
title: Tasks — El carril patch acepta ajustes visuales
spec: ./spec.md
plan: ./plan.md
created: 2026-09-28
---

# Tasks — El carril patch acepta ajustes visuales (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0098-visual-patch-lane`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Las puertas admiten el ajuste solo de presentación | done | d6b4255 | GREEN 8/8 (v1, v2 2/2 al patch; c1, c2 2/2 a feature) |
| 2 | El patch visual se recorre con la intención y la captura, y cierra en `Changed` | done | 96173bf | GREEN 6/6 (f1 captura fuera de git, f2 Changed, k1 control); campaña 28 sujetos, 6,74 $ |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/VisualPatch.Tests.ps1` + GREEN de v1, v2, c1 y c2 (verificación lenta)
- [x] Task 2 — `Invoke-Pester -Path tests/VisualPatch.Tests.ps1` + GREEN de f1, f2 y k1 (verificación lenta)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

Revisión final: sdd-kit:effort-high + opus, With fixes (0 Critical, 4 Important, 8 Minor), sobre 96173bf
Pasada de fix: 274834f (juntado en el commit de cierre), 4 hallazgos RED→GREEN (I1, I2 con I2 bis, I3, M1); I4 retirado por RED limpio
