---
id: 20260923-213417-task-0031-dispatch-effort
title: Tasks — Effort real al despachar
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — Effort real al despachar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0031`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Tipos de agente y texto que los nombra | pending | — | |
| 2 | Campaña GREEN y evidencia | pending | — | en línea |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester -Path tests/AgentDefinitions.Tests.ps1,tests/Skills.Tests.ps1,tests/Manifests.Tests.ps1,tests/ProportionalReview.Tests.ps1`
- [ ] Task 2 — 2 sujetos detrás del proxy: llamada `Agent` con `sdd-kit:effort-medium` y peticiones con `effort: medium`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
