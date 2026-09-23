---
id: 20260923-143450-task-0040-close-push
title: Tasks — Final del cierre: push autorizado y aviso de terminado
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — Final del cierre: push autorizado y aviso de terminado (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0040`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `merge.push`: clave, gates y pregunta | in_progress | — | en línea |
| 2 | Push en el paso de rama | pending | — | en línea |
| 3 | Paso «Mensaje final» | pending | — | en línea |
| 4 | GREEN | pending | — | en línea |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester -Path tests/ControlProfiles.Tests.ps1, tests/MigrationInitParity.Tests.ps1`
- [ ] Task 2 — `Invoke-Pester -Path tests/ControlProfiles.Tests.ps1`
- [ ] Task 3 — `Invoke-Pester -Path tests/ControlProfiles.Tests.ps1`
- [ ] Task 4 — veredictos del GREEN en `green/out/`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
