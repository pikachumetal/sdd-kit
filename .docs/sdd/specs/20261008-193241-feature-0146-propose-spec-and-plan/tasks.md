---
id: 20261008-193241-feature-0146-propose-spec-and-plan
title: Tasks — Spec y plan de propose
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Spec y plan de propose (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0146-entry-explore-propose`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Batería de `sdd-start-feature`, escenarios nuevos y RED | done | — | RED: 7 reglas fallan, 3 salen limpias (T1, l2, P2) |
| 2 | La spec abre con 🦆 y ✋, y dice dónde se prueba | pending | — | |
| 3 | Gate con opciones fijas y modelo del revisor de dominio | done | — | GREEN g1 y r1 2/2 |
| 4 | El plan declara `Tras` y su verificación sale de «Dónde se prueba» | done | — | GREEN p1: Tras 2/2 tras una ronda de REFACTOR; la verificación salió por el RED |
| 5 | Acción update | pending | — | |
| 6 | La validación abre con 🦆 y ✋ | pending | — | |
| 7 | `sdd-grilling` contrasta el lenguaje | skipped | — | sale por el RED (`t1` 2/2 limpio); enmienda del 2026-10-08 |
| 8 | Ajustes de `sdd-rubber-duck` | pending | — | |

## Verificación por task

- [ ] Task 1 — `bash -n` de `subject.sh`; `battery.mjs plan` de las tres baterías; `PathLength` y `SubjectOutputPrivacy` con `-CI`; RED puntuado
- [ ] Task 2 — `CapabilityRules` y `WordBudget` con `-CI`; GREEN de `s1`
- [ ] Task 3 — `WordBudget` con `-CI`; GREEN de `g1` y `r1`
- [ ] Task 4 — `PlanReviewFocus` y `WordBudget` con `-CI`; GREEN de `p1`
- [ ] Task 5 — `WordBudget` con `-CI`; GREEN de `u1`
- [ ] Task 6 — `WordBudget` con `-CI`; GREEN de `v1a` y `v1b`
- [x] Task 7 — skipped: sale por el RED
- [ ] Task 8 — `WordBudget` con `-CI`; GREEN de `s2`, y `l2` como control

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
