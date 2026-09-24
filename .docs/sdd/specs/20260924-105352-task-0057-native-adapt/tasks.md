---
id: 20260924-105352-task-0057-native-adapt
title: Tasks — Adaptar el kit a Native
spec: ./spec.md
plan: ./plan.md
created: 2026-09-24
---

# Tasks — Adaptar el kit a Native (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0057`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Bucle Native en el paso 6 | done | 5c26769 | ruling: ancla de NativeDefault.Tests.ps1:130 estrechada |
| 2 | Historia de commits | done | — | |
| 3 | Revisor final, tipo de effort y cierre | pending | — | |
| 4 | Cambio a SDD tras una compactación | pending | — | |
| 5 | GREEN | pending | — | |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester` de NativeAdapt, NativeDefault, SuperpowersCompat y Skills
- [ ] Task 2 — `Invoke-Pester` de NativeAdapt, CommitMilestones y Skills
- [ ] Task 3 — `Invoke-Pester` de NativeAdapt, Skills, AgentDefinitions y CommitMilestones
- [ ] Task 4 — `Invoke-Pester` de NativeAdapt, NativeDefault y Skills
- [ ] Task 5 — campaña GREEN con `red/run.sh`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
