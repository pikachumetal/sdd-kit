---
id: 20261012-104247-feature-0166-worktrees-and-parallel-agents
title: Tasks — sdd-worktrees y sdd-parallel-agents
spec: ./spec.md
plan: ./plan.md
created: 2026-10-12
---

# Tasks — `sdd-worktrees` y `sdd-parallel-agents` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0166-worktrees-and-parallel-agents`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los dos desvíos de `sdd-implement` | done | `39868b0` | entra el del REFACTOR (RED 2/2, GREEN 2/2); el de «No entra» no (RED 0/2), enmienda 2026-10-12 |
| 2 | `sdd-worktrees` y el recableado | done | `d59bf7b` | humo `w1` 1/1 |
| 3 | `sdd-parallel-agents` y `review-spec.md` | done | `1d1fd15` | humo `a1` 1/1 |
| 4 | Documentos, avisos, roadmap y topes | done | — | |

## Verificación por task

- [x] Task 1 — `bash -n` de `subject.sh` y el campo `Petición` de `k1`
- [x] Task 2 — `Invoke-Pester tests/ForkSkills.Tests.ps1, tests/Skills.Tests.ps1, tests/WordBudget.Tests.ps1 -CI`
- [x] Task 3 — el mismo Pester
- [x] Task 4 — Pester con `WorkflowDocs` y `sdd roadmap check`

## Fixes adicionales

Ninguno.
