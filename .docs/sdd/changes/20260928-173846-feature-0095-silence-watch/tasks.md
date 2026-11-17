---
id: 20260928-173846-feature-0095-silence-watch
title: Tasks — El vigía de silencio detecta un subagente colgado sin que nadie pregunte
spec: ./spec.md
plan: ./plan.md
created: 2026-09-28
---

# Tasks — El vigía de silencio (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0095-silence-watch`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El script del vigía | done | `0f286e4b` | 10 tests nuevos; smoke `TERMINADO` sobre un transcript real |
| 2 | La guía del vigía, con su campaña | done | `73f30c29` | RED 0/12, GREEN 13/13; 13,45 $ |

Plan sin gate (`delegate`): cada escenario de la spec tiene su task (plan §4).

Ruling: la previsión de la campaña pasa de 22 a 23 sujetos, con uno de control para `sdd-config` P5; queda dentro del techo de la spec (28 sujetos o 18 $).

Ruling: la campaña son 25 sujetos (12 RED + 13 GREEN, con el control de sdd-config P5) y 13,45 $ con los 2 descartados por el entorno; la tabla de racionalizaciones no suma la de s5d/s5u porque el GREEN la cierra sin ella.
Ruling: el paso 7 de sdd-start-feature no se edita: la re-revisión usa el encargo del revisor final, que ya lleva el vigía (ncargo-revision.md).
Ruling: tests estáticos en 	ests/SilenceWatch.Tests.ps1, nuevo, en vez de ampliar ControlProfiles.Tests.ps1.

## Verificación por task

- [x] Task 1 — `Invoke-Pester tests/Watch-SubagentSilence.Tests.ps1, tests/Measure-SessionTokens.Tests.ps1`
- [x] Task 2 — `Invoke-Pester tests/ControlProfiles.Tests.ps1, tests/WorkflowDocs.Tests.ps1` + GREEN de la campaña

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

Revisión final: sdd-kit:effort-high + opus, With fixes (0 Critical, 4 Important, 8 Minor), sobre 73f30c2
Pasada de fix: 13b19739, 7 hallazgos RED→GREEN (uno de guía, con sujeto de control)
