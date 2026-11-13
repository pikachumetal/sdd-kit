---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 56e2b56 | |
| 2 | Listado de canceladas | done | — | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

_Ninguno_
