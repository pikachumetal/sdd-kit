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
| 1 | Las puertas admiten el ajuste solo de presentación | pending | — | |
| 2 | El patch visual se recorre con la intención y la captura, y cierra en `Changed` | pending | — | |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester -Path tests/VisualPatch.Tests.ps1` + GREEN de v1, v2, c1 y c2 (verificación lenta)
- [ ] Task 2 — `Invoke-Pester -Path tests/VisualPatch.Tests.ps1` + GREEN de f1, f2 y k1 (verificación lenta)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
