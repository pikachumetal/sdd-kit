---
id: 20260923-191212-task-0044-commit-per-milestone
title: Tasks — Un commit por hito: apertura, cada task y cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — Un commit por hito (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0044`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La forma en la task, en la constitution y en las plantillas | done | 703fc0b | revisión limpia; rango de un solo commit, nada que juntar |
| 2 | El carril patch | done | 9582af8 | revisión limpia tras un ruling (trailer de atribución); rango de un solo commit |
| 3 | GREEN | done | f480201 | 12 sujetos, 3,93 $; G4 0/2 → REFACTOR de `sdd-end-patch` paso 2 → 2/2 |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/CommitMilestones.Tests.ps1, tests/Skills.Tests.ps1, tests/TaskVerification.Tests.ps1`
- [x] Task 2 — `Invoke-Pester -Path tests/CommitMilestones.Tests.ps1, tests/Skills.Tests.ps1`
- [x] Task 3 — veredictos del GREEN en `green/out/`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
