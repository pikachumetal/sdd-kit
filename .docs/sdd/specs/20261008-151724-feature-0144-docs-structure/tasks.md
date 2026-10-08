---
id: 20261008-151724-feature-0144-docs-structure
title: Tasks — Documentos de la 3.0.0: estructura nueva, plantillas y rutas de la CLI
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Documentos de la 3.0.0 (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0144-docs-and-migration`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Rutas de la CLI para la estructura 3.0.0 y la 2.x | done | `a8e9d61` | |
| 2 | Sustantivo `decision`: `check` e `index` | done | `815153f` | Las 11 ADR del repo pasan `decision check` sin cambios |
| 3 | Plantillas de la 3.0.0 e índice de `sdd-templates`, con su humo | done | `4523e14` | Humo 2/2, 0,41 $; topes de `sdd-templates` y del kit suspendidos (enmienda) |
| 4 | Constitution y ADR 0012 | done | — | |

## Verificación por task

- [x] Task 1 — `tsc --noEmit` y Vitest de `layout`, `roadmap`, `estimation` e `ids`
- [x] Task 2 — `tsc --noEmit`, Vitest de `decisions`, `cli` y `docs-claims`, y `sdd decision check` sobre el repo
- [x] Task 3 — Pester de `AnchorTemplates`, `WordBudget` y `FrontendVerification`; Vitest de `decisions` y `docs-claims`; humo h1 y h2
- [x] Task 4 — Pester de `WordBudget` y `sdd decision check` sobre el repo

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
