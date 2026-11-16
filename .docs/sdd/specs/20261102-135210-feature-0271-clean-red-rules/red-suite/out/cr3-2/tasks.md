---
id: 20261008-130000-feature-0028-close-notice-pending
title: Tasks — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
plan: ./plan.md
created: 2026-11-02
---

# Tasks — El aviso de cierre dice qué queda pendiente (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0028-close-notice-pending`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El paso 1 nombra lo pendiente | pending | — | |
| 2 | El paso 2 repite lo pendiente (condicional) | pending | — | Se salta si el RED de `c2` sale 0 de 3 |

## Verificación por task

- [ ] Task 1 — `node --test`, `node scripts/lint.mjs`, `c1` RED 2 y GREEN 2
- [ ] Task 2 — `node --test`, `node scripts/lint.mjs`, `c2` RED 3 y GREEN 2

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

_Ninguno_
