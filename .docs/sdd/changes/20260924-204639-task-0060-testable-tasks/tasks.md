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
| 1 | Plantillas: tasks verticales, escenarios con datos y reglas completas | done | 8bbd796 | |
| 2 | `sdd-start-task`: guion de pruebas en la validación y en la parada de `pair` | done | a691c49 | |
| 3 | GREEN y evidencia | done | 2c4f0e3 | REFACTOR de `plan-template.md` §2 tras el GREEN p3 (ruling del ledger) |

## Verificación por task

- [x] Task 1 — `Invoke-Pester` de `TestableTasks`, `CapabilityRules`, `TaskVerification` y `DispatchBrief`
- [x] Task 2 — suite rápida (`-ExcludeTagFilter Slow`)
- [x] Task 3 — `PathLength` y `TestableTasks`, y ninguna ruta con el usuario de la máquina

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión final: el paso 0 de `sdd-end-task` presenta la validación con «cómo probarlo» | La spec solo nombraba los pasos 6 y 7 de `sdd-start-task`; el paso 0 es la otra entrada al mismo gate | El dev-lead decidió arreglarlo aquí: «Arreglarlo aquí (Recomendada)» (enmienda de la spec) | commit de cierre |

Revisión final: sdd-kit:effort-high + opus, con arreglos (1 Important de alcance: el paso 0 de sdd-end-task conserva «cómo probarlo»; 5 Minor diferidos)
