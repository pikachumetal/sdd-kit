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
| 1 | Tipos de agente y texto que los nombra | done | 7263e43 | review limpia; 1 minor aparcado (tres agentes casi iguales, los manda el plan) |
| 2 | Campaña GREEN y evidencia | done | 0db8175 | en línea; 2/2 sujetos, 10/10 peticiones del subagente con effort medium |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/AgentDefinitions.Tests.ps1,tests/Skills.Tests.ps1,tests/Manifests.Tests.ps1,tests/ProportionalReview.Tests.ps1`
- [x] Task 2 — 2 sujetos detrás del proxy: llamada `Agent` con `sdd-kit:effort-medium` y peticiones con `effort: medium`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
