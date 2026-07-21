---
id: 20260721-114445-task-0000-consult-skill
title: Tasks — sdd-consult
spec: ./spec.md
plan: ./plan.md
created: 2026-07-21
---

# Tasks — sdd-consult (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (rama única del kit)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Fixtures para los escenarios de consulta | done | — | 6 copias limpias de "TimeTrack" post-v0.2.0; solo scratchpad |
| 2 | RED: baseline sin la skill (workflow) | done | — | 2 rondas: RED1 telegrafiado (descartado) → RED2 limpio. Único fallo real: S3 fabricó hotfix.md + id inventado. Contexto NO es fallo (baseline lo prima bien) |
| 3 | Escribir la skill dirigida a los fallos | done | — | Ligera: técnica + receta grilling/no-brainstorming + núcleo disciplinario (handoff/no-artefactos) del S3 |
| 4 | GREEN: re-verificación + REFACTOR (workflow) | done | ea4f0ba | 3/3 en verde (wf_772af0b3), S3 revierte el fallo; sin REFACTOR |
| 5 | Integración documental | done | b8fdd3c | mission, architecture, README, CLAUDE.md + spec/plan/tasks |
| 6 | Cierre (sdd-end-task) | done | — | walkthrough, estimation-log, changelog, aprendizaje a tech-stack (commit de cierre) |

## Verificación por task

- [x] Task 1 — 6 copias limpias; el acta contiene el cambio de requisito de Sevilla y el triage de SSO
- [x] Task 2 — estado en disco verificado; RED2 S3 fabricó hotfix.md + id inventado (racionalizaciones citadas)
- [x] Task 3 — description solo-cuándo-usar; guidance dirigida al fallo real de S3
- [x] Task 4 — GREEN 3/3; S3 revertido y verificado en disco; sin REFACTOR
- [x] Task 5 — grep sin recuentos obsoletos (README status corregido de paso)
- [x] Task 6 — walkthrough con tiempo real (~1,4h) + estimation-log + changelog + tech-stack

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
