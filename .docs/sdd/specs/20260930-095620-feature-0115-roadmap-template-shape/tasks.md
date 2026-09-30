---
id: 20260930-095620-feature-0115-roadmap-template-shape
title: Tasks — El roadmap en la forma de la plantilla
spec: ./spec.md
plan: ./plan.md
created: 2026-09-30
---

# Tasks — El roadmap en la forma de la plantilla (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0115-roadmap-template-shape`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Validador y plantilla | done | fdcabcc1 | |
| 2 | Migración a v2.3.0 y GREEN | done | 700f394a | |
| 3 | Documentos acotados: principio y tabla | done | c3543159 | |
| 4 | Este roadmap, migrado | done | — | gate del dev-lead en el Step 4 |

## Verificación por task

- [x] Task 1 — Pester de `Test-Roadmap`, `RoadmapStructure`, `Skills` y `AnchorTemplates`
- [x] Task 2 — Pester de `MigrationInitParity`, `PathLength` y `SubjectOutputPrivacy`; GREEN g1, g2 y g3
- [x] Task 3 — conjunto rápido de Pester
- [x] Task 4 — conjunto rápido de Pester y `Test-Roadmap.ps1` sobre `.docs/sdd`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- 2026-09-30 — RED sin vigía de silencio: `SUBJECT_TIMEOUT=900` del lanzador ya corta a cada sujeto.
