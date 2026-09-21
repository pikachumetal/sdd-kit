---
id: 20260921-074701-task-0004-release-without-client
title: Tasks — Carril release opcional y fuera de un contexto de cliente
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Carril release opcional (registro vivo)

- **Spec**: `./spec.md` (aprobada 2026-09-21)
- **Plan**: `./plan.md` (aprobado 2026-09-21: «si, aprobado»)
- **Rama**: `feature/0004`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Campaña RED | done | `465525e` | Diez sujetos (E5 añadido tras leer E1–E4). Recorte reaprobado por el dev-lead: cinco puntos sin guía nueva |
| 2 | Guía del carril release | in-progress | | Implementador Sonnet, effort high declarado en el encargo |
| 3 | Campaña GREEN | pending | | |

## Verificación por task

- [x] Task 1 — `tests/release-flow-red.md`, artefactos en `red/`
- [ ] Task 2 — `Invoke-Pester tests` verde con `tests/ReleaseFlow.Tests.ps1`
- [ ] Task 3 — `tests/release-flow-green.md`, artefactos en `green/`

## Desviaciones

- El tool `Agent` no expone effort: se declara en el encargo (Art. IV, desviación ya conocida).
