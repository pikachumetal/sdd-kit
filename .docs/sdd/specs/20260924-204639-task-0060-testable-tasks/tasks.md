---
id: 20260924-204639-task-0060-testable-tasks
title: Tasks — Tasks que se prueban, escenarios con datos y guion de pruebas
spec: ./spec.md
plan: ./plan.md
created: 2026-09-24
---

# Tasks — Tasks que se prueban, escenarios con datos y guion de pruebas (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0060`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Plantillas: tasks verticales, escenarios con datos y reglas completas | pending | — | |
| 2 | `sdd-start-task`: guion de pruebas en la validación y en la parada de `pair` | pending | — | |
| 3 | GREEN y evidencia | pending | — | |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester` de `TestableTasks`, `CapabilityRules`, `TaskVerification` y `DispatchBrief`
- [ ] Task 2 — suite rápida (`-ExcludeTagFilter Slow`)
- [ ] Task 3 — `PathLength` y `TestableTasks`, y ninguna ruta con el usuario de la máquina

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
