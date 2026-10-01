---
id: 20261001-153446-feature-0117-patch-lane-fixed-solution
title: Tasks — Carril patch: lo decide quién fijó la solución
spec: ./spec.md
plan: ./plan.md
created: 2026-10-01
---

# Tasks — Carril patch: lo decide quién fijó la solución (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0117-patch-lane-fixed-solution`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Criterio por quién fija la solución y petición cerrada | done | — | GREEN tras tres rondas de REFACTOR; techo a 55 |
| 2 | Retirada en el patch visual | pending | — | |
| 3 | Lite con migración de datos y deuda parcial | pending | — | |

## Verificación por task

- [x] Task 1 — `Invoke-Pester tests/PatchLane.Tests.ps1` y GREEN `p1 p2 b1 b2 c1 c2 k1 d1`
- [ ] Task 2 — Pester y GREEN `r1 r2 r3`
- [ ] Task 3 — Pester y GREEN `l1 e1`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
