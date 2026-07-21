---
id: 20260721-082038-task-0000-release-skills
title: Tasks — Carril release sdd-start-release y sdd-end-release
spec: ./spec.md
plan: ./plan.md
created: 2026-07-21
---

# Tasks — Carril release (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (convención actual del kit: rama única)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Fixture "TimeTrack" con material de release | done | — | Solo scratchpad, no se versiona |
| 2 | Ciclo RED+GREEN en paralelo (workflow ultracode) | done | — | wf_3e3be814 (GREEN×2) + wf_d20f2644 (RED×2, single-source); 8 runs verificados en disco |
| 3 | Análisis de huecos y mejoras de las skills | done | 5a4782c | Huecos cerrados y re-verificados en GREEN-2 (wf_7b2da3b3): merge/tag→gate, gate de entrada con evidencia faltante, paso 6 atado al gate de scope, ids no se inventan |
| 4 | Verificación y commit de la fuente única de plantillas | done | 8b47f33 | Evidencia en tests/templates-single-source-green.md |
| 5 | Plantillas nuevas en sdd-templates | done | 5a4782c | feedback-template + release-notes-template + tabla + puntero add-to-changelog |
| 6 | Evidencia RED/GREEN en tests/ | done | 5a4782c | 4 ficheros; veredicto por fallo del RED + REFACTOR documentado |
| 7 | Integración documental | done | 602deb2 | mission, architecture, constitution, roadmap, README, CLAUDE.md + spec/plan/tasks |
| 8 | Cierre (sdd-end-task) | done | — | Walkthrough + estimation-log + changelog + aprendizajes a docs vivos (commit de cierre, posterior a esta edición) |

## Verificación por task

- [x] Task 1 — listado en disco de la fixture; escenarios cubren las tentaciones de la spec §4.1
- [x] Task 2 — salidas estructuradas de los 8 runs (5+3 tras el bug de args) + inspección en disco de cada copia
- [x] Task 3 — cada hueco del GREEN con mejora aplicada y re-verificada en GREEN-2 (fixtures frescas)
- [x] Task 4 — evidencia escrita; diff de las skills commiteado (8b47f33)
- [x] Task 5 — skills de release referencian las plantillas por nombre (verificado en GREEN-2: las calcaron)
- [x] Task 6 — cada fallo RED con veredicto GREEN (+ huecos propios del GREEN-1 con REFACTOR)
- [x] Task 7 — grep sin restos obsoletos (solo históricos inmutables y menciones correctas en contexto)
- [x] Task 8 — walkthrough con tiempo real + estimation-log + changelog + aprendizajes a docs vivos

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
