---
id: 20260925-163055-task-0064-task-to-feature-rename
title: Tasks — Renombrado task → feature
spec: ./spec.md
plan: ./plan.md
created: 2026-09-25
---

# Tasks — Renombrado task → feature (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0064-task-to-feature-rename`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Lectores y plantillas con `feature` | done | af6e722 | el THEN literal de `task-ids` pasa antes de implementar (el patch 0080 manda); discrimina el AND `feature-only` |
| 2 | Renombrar las skills y su vocabulario | done | — | formato de cierre `**[<Task|Patch> …]**` del roadmap conservado (ruling) |
| 3 | Migración, docs vivos y guarda | pending | — | |
| 4 | Campaña de enrutado y de migración | pending | — | |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/Get-NextSddId.Tests.ps1, tests/Build-EstimationLog.Tests.ps1, tests/FeatureRename.Tests.ps1, tests/AnchorTemplates.Tests.ps1 -Output Detailed`
- [x] Task 2 — `Invoke-Pester -Path tests -ExcludeTagFilter Slow -Output Minimal` + `tests/Hook.Tests.ps1`, `tests/Manifests.Tests.ps1`
- [ ] Task 3 — `Invoke-Pester -Path tests/FeatureRename.Tests.ps1, tests/MigrationInitParity.Tests.ps1, tests/WorkflowDocs.Tests.ps1, tests/Skills.Tests.ps1 -Output Detailed`
- [ ] Task 4 — `Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1 -Output Detailed`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

Ninguno.
