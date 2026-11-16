---
id: 20261008-130000-feature-0028-close-notice-pending
title: Tasks — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
plan: ./plan.md
created: 2026-11-16
---

# Tasks — El aviso de cierre dice qué queda pendiente (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0028-close-notice-pending`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Molde falsable y RED | pending | — | |
| 2 | Paso 1 del aviso y GREEN de `c1` | pending | — | |
| 3 | Paso 2 repite lo pendiente (solo si el RED lo exhibe) | pending | — | condicional: con el RED de `c2` limpio en 3 de 3, `skipped` con `Ruling:` |

## Verificación por task

- [ ] Task 1 — `node --test` → `ℹ fail 0`; `git ls-files` sin `pendientes.md`; previsión 5 sujetos, 3,50 $; RED medido
- [ ] Task 2 — GREEN de `c1`: 2 de 2 cumplen
- [ ] Task 3 — GREEN de `c2`: 2 de 2 cumplen (o `skipped`)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

_Ninguno_
