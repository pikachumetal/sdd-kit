---
id: 20261014-163837-feature-0148-verify-review
title: Tasks — verify: sdd-verify, revisión final en tres ejes con un solo cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-10-14
---

# Tasks — verify: `sdd-verify`, revisión final en tres ejes con un solo cierre (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0148-verify-review`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd-verify` nace: la evidencia antes de afirmar | done | 02afa007 | |
| 2 | La revisión final sale por ejes, y el plan declara el eje Arquitectura | done | — | dos rondas de REFACTOR en `f2` |
| 3 | Los encargos de los tres ejes | pending | — | |
| 4 | El cierre único de la revisión | pending | — | |
| 5 | El revisor de la spec, la ADR, la constitution y los humos | pending | — | |

## Verificación por task

- [x] Task 1 — Pester (`VerifySkill`, `WordBudget`, `Skills`, `ImplementSkill`) y `v1`
- [x] Task 2 — Pester (los que leen `encargo-revision.md`, `SessionModel`, `ImplementSkill`, `WordBudget`, `Skills`), `f1`, `f2` y `p`
- [ ] Task 3 — Pester (`VerifySkill`, `WordBudget`, `Skills`), `f3` y `f4`
- [ ] Task 4 — Pester (`VerifySkill`, `WordBudget`, `Skills`, `ClosingOffCriticalPath`, `SilenceWatch`) y `c1`-`c5`
- [ ] Task 5 — Pester, `decision check`, `s1`, `h1` y `h2`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
