---
id: 20260924-221103-task-0063-end-release-cut
title: Tasks — sdd-end-release simplificado, solo el corte
spec: ./spec.md
plan: ./plan.md
created: 2026-09-25
---

# Tasks — `sdd-end-release` simplificado: solo el corte (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0063`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Recorte de la skill | done | ed9647c | `SKILL.md` de 1468 a 1361 palabras (tras el REFACTOR) |
| 2 | Campaña A/B de no-regresión | done | f456a08 | 17 sujetos, 6,03 $; REFACTOR de la retro tras A2 (enmienda aprobada) |

Revisión final: sdd-kit:effort-high + opus, con arreglos (1 Important corregido: la causa del REFACTOR en la spec y la evidencia; 8 Minor, 3 corregidos por ser datos de la evidencia y 5 diferidos)

## Verificación por task

- [x] Task 1 — `Invoke-Pester` de `ReleaseFlow`, `Skills` y `ControlProfiles`
- [x] Task 2 — `DRY=1` por escenario, coste > 0 en cada `state.txt`, sin usuario en `ab/`, `PathLength.Tests.ps1`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
