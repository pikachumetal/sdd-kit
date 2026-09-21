---
id: 20260921-162234-task-0008-control-profiles
title: Tasks — Perfiles de control y gates
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Perfiles de control y gates (registro vivo)

- **Spec**: `./spec.md` (aprobada 2026-09-21: «Apruebo la spec»)
- **Plan**: `./plan.md` (aprobado 2026-09-21: «1, pero podemos bajar lo de una task un review, se pueden agrupar los reviews?»)
- **Rama**: `feature/0008`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Campaña RED | in-progress | | |
| 2 | Guía de arranque y ejecución | pending | | |
| 3 | Cierre, plantillas, release y migración | pending | | |
| 4 | Campaña GREEN | pending | | |

## Verificación por task

- [ ] Task 1 — `tests/control-profiles-red.md`, artefactos en `red/`
- [ ] Task 2 — `Invoke-Pester tests` verde con el primer bloque de `tests/ControlProfiles.Tests.ps1`
- [ ] Task 3 — `Invoke-Pester tests` verde con los dos bloques
- [ ] Revisión agrupada de las Tasks 2 y 3
- [ ] Task 4 — `tests/control-profiles-green.md`, artefactos en `green/`

## Desviaciones

- El tool `Agent` no expone effort: se declara en el encargo (desviación ya conocida).
