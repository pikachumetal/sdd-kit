---
id: 20261015-104325-feature-0188-closing-estimation-templates
title: Tasks — Estimación y plantillas del cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-10-15
---

# Tasks — Estimación y plantillas del cierre (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0188-closing-estimation-templates`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | CLI: `post hoc` en el log y esfuerzo real medido | pending | — | |
| 2 | Plantillas y método | pending | — | |
| 3 | Cierres: `post hoc` y la línea medida, con RED/GREEN | pending | — | |

## Verificación por task

- [ ] Task 1 — `moon run cli:typecheck cli:test` y `sdd session tokens` sobre este worktree
- [ ] Task 2 — Pester de `ClosingEstimation` y `SessionTokensClose`
- [ ] Task 3 — Pester de `ClosingEstimation` y `SessionTokensClose`, GREEN de `p1` y `f1`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
