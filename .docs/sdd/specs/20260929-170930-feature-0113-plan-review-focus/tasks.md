---
id: 20260929-170930-feature-0113-plan-review-focus
title: Tasks — El plan lleva su Review Focus y el revisor final lo recibe
spec: ./spec.md
plan: ./plan.md
created: 2026-09-29
---

# Tasks — El plan lleva su Review Focus y el revisor final lo recibe (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0113-plan-review-focus`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La plantilla del plan lleva el Review Focus y el revisor final lo recibe | done | — | Alcance recortado por el RED (ruling) |
| 2 | El hilo escribe los tests del Review Focus como un RED más | skipped | — | Baseline e limpio 2/2 (ruling) |

## Verificación por task

- [x] Task 1 — `Invoke-Pester tests/PlanReviewFocus.Tests.ps1` y los que leen la plantilla
- [ ] Task 2 — `Invoke-Pester tests/PlanReviewFocus.Tests.ps1` y los del paso 6

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
