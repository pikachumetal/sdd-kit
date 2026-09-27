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
| 2 | Guía del carril release | done | `cce63e7`, `789d508` | Implementador Sonnet (effort high declarado en el encargo). Revisor de task: spec ✅, dos Important mandados por el plan (Overview y paso 5 contradecían el predicado) y una Minor (fila combinada), arreglados en una ronda; re-revisión limpia |
| 3 | Campaña GREEN | done | `1d1dda0` | Diez sujetos más E5-bis en los dos brazos (molde `m5` con código real, porque el ruido de `m1` tapaba H2). Los cinco fallos del RED quedan corregidos y el control con cliente no regresa |

## Verificación por task

- [x] Task 1 — `tests/release-flow-red.md`, artefactos en `red/`
- [x] Task 2 — `Invoke-Pester tests`: 205/0, con los tres tests de `tests/ReleaseFlow.Tests.ps1`
- [x] Task 3 — `tests/release-flow-green.md`, artefactos en `green/`

## Desviaciones

- El tool `Agent` no expone effort: se declara en el encargo (Art. IV, desviación ya conocida).
