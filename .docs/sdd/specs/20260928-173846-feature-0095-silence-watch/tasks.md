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
| 1 | El script del vigía | done | (en el commit del hito siguiente) | 10 tests nuevos; smoke `TERMINADO` sobre un transcript real |
| 2 | La guía del vigía, con su campaña | pending | — | |

Plan sin gate (`delegate`): cada escenario de la spec tiene su task (plan §4).

Ruling: la previsión de la campaña pasa de 22 a 23 sujetos, con uno de control para `sdd-config` P5; queda dentro del techo de la spec (28 sujetos o 18 $).

## Verificación por task

- [x] Task 1 — `Invoke-Pester tests/Watch-SubagentSilence.Tests.ps1, tests/Measure-SessionTokens.Tests.ps1`
- [ ] Task 2 — `Invoke-Pester tests/ControlProfiles.Tests.ps1, tests/WorkflowDocs.Tests.ps1` + GREEN de la campaña

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
