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
| 4 | GREEN: re-verificación + REFACTOR (workflow) | in_progress | — | 3/3 en verde (wf_772af0b3), S3 revierte el fallo; sin REFACTOR. Falta commit |
| 5 | Integración documental | pending | — | |
| 6 | Cierre (sdd-end-task) | pending | — | |

## Verificación por task

- [ ] Task 1 — listado en disco; el acta contiene el cambio de requisito de Sevilla y el triage de SSO
- [ ] Task 2 — estado en disco de cada copia + racionalizaciones citadas
- [ ] Task 3 — description no resume workflow; guidance 1:1 con fallos del RED
- [ ] Task 4 — cada fallo RED con veredicto GREEN; handoff anunciado en S3
- [ ] Task 5 — grep sin recuentos obsoletos
- [ ] Task 6 — walkthrough con tiempo real + changelog + roadmap

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
