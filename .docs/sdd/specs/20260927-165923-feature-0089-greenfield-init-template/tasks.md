---
id: 20260927-165923-feature-0089-greenfield-init-template
title: Tasks — Sincronizar sdd-init-greenfield con init-template de sdd-project-template
spec: ./spec.md
plan: ./plan.md
created: 2026-09-27
---

# Tasks — Sincronizar sdd-init-greenfield con init-template (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0089-greenfield-init-template`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Entrevista con fuera de alcance y dominio | pending | — | |
| 2 | GREEN sobre el template | pending | — | |

## Verificación por task

- [ ] Task 1 — `pwsh -NoProfile -Command "Invoke-Pester -Path tests/MigrationInitParity.Tests.ps1, tests/NativeDefault.Tests.ps1"`
- [ ] Task 2 — dos sujetos terminados y la tabla de `tests/init-over-template-green.md`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
