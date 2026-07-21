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
| 7 | Integración documental | in_progress | — | mission, architecture, constitution, roadmap, README, CLAUDE.md editados; commit junto a spec/plan/tasks |
| 8 | Cierre (sdd-end-task) | pending | — | |

## Verificación por task

- [ ] Task 1 — listado en disco de la fixture; escenarios cubren las tentaciones de la spec §4.1
- [ ] Task 2 — salidas estructuradas de los 5 runs + inspección del estado en disco de cada copia
- [ ] Task 3 — cada hueco del GREEN con mejora aplicada y re-verificada
- [ ] Task 4 — evidencia escrita; diff de las 7 skills commiteado
- [ ] Task 5 — skills de release referencian las plantillas por nombre
- [ ] Task 6 — cada fallo RED con veredicto GREEN
- [ ] Task 7 — grep de "7 skills"/"8 skills" sin restos obsoletos
- [ ] Task 8 — walkthrough con tiempo real + changelog + roadmap

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
