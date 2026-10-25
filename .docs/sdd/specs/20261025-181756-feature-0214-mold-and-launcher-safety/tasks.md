---
id: 20261025-181756-feature-0214-mold-and-launcher-safety
title: Tasks — Molde y seguridad de tests/headless/lib.sh, extract.mjs y battery.mjs
spec: ./spec.md
plan: ./plan.md
created: 2026-10-25
---

# Tasks — Molde y seguridad de `tests/headless/lib.sh`, `extract.mjs` y `battery.mjs` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0214-mold-and-launcher-safety`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Hook por defecto y parada por puerto | pending | — | |
| 2 | Nombre y email reales: fallo, evidencia ampliada y barrido | pending | — | |
| 3 | Volcado, siembra, copia del kit y rutas largas | pending | — | |
| 4 | Líneas sin parsear y «cualquiera» | pending | — | |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1,tests/DenyKillHook.Tests.ps1 -CI`
- [ ] Task 2 — `Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1,tests/HeadlessLauncher.Tests.ps1 -CI`
- [ ] Task 3 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI`
- [ ] Task 4 — `Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1,tests/Battery.Tests.ps1 -CI`

## Fixes adicionales

Ninguno.
