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
| 1 | Campaña RED (baseline) | done | `0341f2d` | 10 sujetos, 7,48 $. Fallan 2 de 14 conductas medidas; recorte estricto aprobado por el dev-lead |
| 2 | Validador `Test-Capabilities.ps1` | skipped | `79bec32`, revertido en `ca51ef4` | Implementador Sonnet, ~167k tokens, suite 214/0. Retirado: el RED no exhibió los errores que vigila |
| 3 | Las dos reglas en sus puntos de uso (en línea) | done | `9a2089a` | Más el `MODIFIED` de bloque entero. 9 tests estructurales; suite 211/0; `plugin validate --strict` limpio |
| 4 | GREEN (m1, m2 × 2) | done | `eee671f` | 4 sujetos, 3,20 $. Los dos fallos corregidos 2/2; positivos intactos |
| 5 | Forma final y validador en los puntos de uso | skipped | — | Fuera por el recorte |
| 6 | GREEN fase B y volcado inicial | skipped | — | Fuera por el recorte; el volcado pasa a la 0012 |

## Verificación por task

- [x] Task 1 — `tests/capabilities-red.md`, artefactos en `red/`
- [x] Task 2 — 214/0 con el validador; revertido en `ca51ef4`
- [x] Task 3 — `Invoke-Pester tests` en verde con `tests/CapabilityRules.Tests.ps1` (211/0)
- [x] Task 4 — veredicto en `tests/capabilities-green.md`, artefactos en `green/`
- [ ] Task 5 — `Invoke-Pester tests` y `claude plugin validate --strict skills/`
- [ ] Task 6 — veredicto por fallo del RED en `tests/capabilities-green.md`

## Desviaciones

- **Effort no fijable** (Art. IV): el tool `Agent` acepta `model` y no `effort`. Los subagentes corren con el effort por defecto de su definición; el plan declara el que se pediría.

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión final de rama (Sonnet): regla 3 de `capability-template` fuera del plan y sin test; ayuda con `(antes: …)` desactualizada | Edición coherente con el requisito de fusión, no declarada | Aceptado: al plan, a la spec y con test. Rechazado el hallazgo de Art. I: el `MODIFIED` de bloque entero es la decisión 9 del dev-lead | `b82f8ee` |
