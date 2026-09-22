---
id: 20260922-083703-task-0013-postponed-anchor
title: Tasks — Anclaje pospuesto sin vía de retorno
spec: ./spec.md
plan: ./plan.md
created: 2026-09-22
---

# Tasks — Anclaje pospuesto sin vía de retorno (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0013`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Siete plantillas de documentos SDD | done | `ed7130f` | En línea; tests RED del hilo en `tests/AnchorTemplates.Tests.ps1` |
| 2 | Consumidores: cierre, nombrado e init | done | `12d9fbd` | En línea; incluye `sdd-init-greenfield/SKILL.md` paso 3 |
| 3 | GREEN | in_progress | — | |

## Verificación por task

- [x] Task 1 — suite Pester verde (283/0)
- [x] Task 2 — suite Pester verde (283/0)
- [ ] Task 3 — veredicto por THEN en `green/README.md`

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
