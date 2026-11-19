---
id: 20261008-130000-feature-0028-close-notice-pending
title: Tasks — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
plan: ./plan.md
created: 2026-11-19
---

# Tasks — El aviso de cierre dice qué queda pendiente (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0028-close-notice-pending`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Molde de `c1` y RED de `c1` | pending | — | |
| 2 | Paso 1 y GREEN de `c1` | pending | — | |
| 3 | RED de `c2` y, solo si exhibe, paso 2 | pending | — | |

## Verificación por task

- [ ] Task 1 — previsión de `c1` N=2; 2 filas `c1 · RED` en `pruebas.md`
- [ ] Task 2 — previsión de `c1` N=2; 2 filas `c1 · GREEN` con `pasa`
- [ ] Task 3 — previsión de `c2` N=3 (y N=2 si exhibe); veredicto en `pruebas.md`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

_Ninguno_
