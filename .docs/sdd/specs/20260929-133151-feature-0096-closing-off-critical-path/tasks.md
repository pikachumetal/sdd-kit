---
id: 20260929-133151-feature-0096-closing-off-critical-path
title: Tasks — El cierre fuera del camino crítico
spec: ./spec.md
plan: ./plan.md
created: 2026-09-29
---

# Tasks — El cierre fuera del camino crítico (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0096-closing-off-critical-path`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | RED de conducta | done | c9c4ff9 | c2 pasa 2/2: enmienda aprobada |
| 2 | Revisor final en segundo plano y aislado | done | 65804fa | |
| 3 | Borradores de cierre mientras revisa | pending | — | |
| 4 | Todo sha de `tasks.md` alcanzable tras el cierre | pending | — | |
| 5 | GREEN | pending | — | |

## Verificación por task

- [ ] Task 1 — cada `state.txt` con coste > 0; evidencia con tabla por escenario y coste
- [ ] Task 2 — `Invoke-Pester -Path tests/ClosingOffCriticalPath.Tests.ps1,tests/Skills.Tests.ps1`
- [ ] Task 3 — ídem
- [ ] Task 4 — ídem
- [ ] Task 5 — evidencia GREEN con controles; coste acumulado ≤ 35 $

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
