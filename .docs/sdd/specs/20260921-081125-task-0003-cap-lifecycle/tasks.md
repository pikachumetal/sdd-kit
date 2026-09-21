---
id: 20260921-081125-task-0003-cap-lifecycle
title: Tasks — Capabilities, ciclo de vida completo
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Capabilities: ciclo de vida completo (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0003`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Campaña RED (baseline) | done | (este commit) | 10 sujetos, 7,48 $. Fallan 2 de 14 conductas medidas; recorte estricto aprobado por el dev-lead |
| 2 | Validador `Test-Capabilities.ps1` | skipped | `79bec32`, revertido en `ca51ef4` | Implementador Sonnet, ~167k tokens, suite 214/0. Retirado: el RED no exhibió los errores que vigila |
| 3 | Las dos reglas en sus puntos de uso (en línea) | pending | — | |
| 4 | GREEN (m1, m2 × 2) | pending | — | |
| 5 | Forma final y validador en los puntos de uso | skipped | — | Fuera por el recorte |
| 6 | GREEN fase B y volcado inicial | skipped | — | Fuera por el recorte; el volcado pasa a la 0012 |

## Verificación por task

- [ ] Task 1 — `tests/capabilities-red.md`, artefactos en `red/`
- [ ] Task 2 — `Invoke-Pester tests` en verde con `tests/Test-Capabilities.Tests.ps1`
- [ ] Task 3 — `Invoke-Pester tests` en verde con `tests/CapabilityRules.Tests.ps1`
- [ ] Task 4 — veredicto por brazo en `tests/capabilities-green.md`, artefactos en `green/`
- [ ] Task 5 — `Invoke-Pester tests` y `claude plugin validate --strict skills/`
- [ ] Task 6 — veredicto por fallo del RED en `tests/capabilities-green.md`

## Desviaciones

- **Effort no fijable** (Art. IV): el tool `Agent` acepta `model` y no `effort`. Los subagentes corren con el effort por defecto de su definición; el plan declara el que se pediría.

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
