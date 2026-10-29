---
id: 20261029-082734-feature-0236-project-gate-levels
title: Tasks — El gate de los proyectos por niveles y por lo afectado
spec: ./spec.md
plan: ./plan.md
created: 2026-10-29
---

# Tasks — El gate de los proyectos por niveles y por lo afectado (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0236-project-gate-levels`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `operations.md` con nivel, «Sin filtro», «Lint» y «CI de la base», y quien los propone | done | 621bee5 | `pl3` limpio en el RED: sin regla en plan-template |
| 2 | Correr un gate: unitarios enteros, salvaguarda, tras un rojo y lint | done | (este commit) | un solo commit con la Task 3: comparten el paso 1, el paso 6 y la batería de sdd-archive |
| 3 | Lo que trae la base y el conflicto solo de docs | done | (este commit) | con la Task 2; G7b, G8b y M1c sin medir tras su afinado (dev-lead: «Cerrar con lo medido») |

## Verificación por task

- [ ] Task 1 — Vitest de `cli/test/kit/` y GREEN de `n7`, `v4`, `g2`, `pl3`
- [ ] Task 2 — GREEN de `g7`, `t1`, `t2`; humo de `g6`, `w2`, `k6`
- [ ] Task 3 — GREEN de `g8`, `m1`, `m2`, `g5`; control de `a3`

## Fixes adicionales

Ninguno.
