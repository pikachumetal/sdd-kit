---
id: 20260907-184057-task-0000-progressive-disclosure
title: Tasks — Progressive disclosure de las skills del kit
spec: ./spec.md
plan: ./plan.md
created: 2026-09-07
---

# Tasks — Progressive disclosure de las skills del kit (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (el kit es de rama única, `tech-stack.md` §Git)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Ola 0 — enmienda del Art. I y criterio en `architecture.md` | in_progress | — | Sin subagentes. Gobierna cómo se testea el resto |
| 2 | Ola 1 — A/B de `sdd-start-task` | pending | — | 4 escenarios (A, B, lite, spike) × 2 brazos. Checkpoint con el dev-lead al cerrar |
| 3 | Ola 2 — A/B de `sdd-end-release`, `sdd-consult`, `sdd-start-release`, `sdd-end-task` | pending | — | Hereda las hipótesis supervivientes de la ola 1 |
| 4 | Ola 3 — A/B de las seis skills cortas | pending | — | Incluye redactar escenarios para `sdd-templates` (hueco preexistente) |
| 5 | Cierre documental — roadmap T2 y `tech-stack.md` | pending | — | El cierre de la task va por `sdd-end-task`, no aquí |

## Verificación por task

- [ ] Task 1 — los tres bloques insertados no contradicen el resto de la constitution; el criterio (a)+(b) coincide literalmente con la spec §4.1
- [ ] Task 2 — veredicto por escenario verificado en disco, no por autoinforme; `tests/sdd-start-task-ab.md` escrito
- [ ] Task 3 — cuatro ficheros `-ab.md` escritos, con cortes descartados y su motivo
- [ ] Task 4 — seis ficheros `-ab.md` escritos, incluidos los "sin cortes"
- [ ] Task 5 — `grep -rn "TodoWrite" .docs/` sin afirmaciones vivas sobre arreglar las 8 skills

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
