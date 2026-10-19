---
id: 20261019-092924-feature-0193-better-merge
title: Tasks — Merge mejor que el de git por defecto
spec: ./spec.md
plan: ./plan.md
created: 2026-10-19
---

# Tasks — Merge mejor que el de git por defecto (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0193-better-merge`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Opciones de git y Mergiraf en la cadena de resolución | done | — | reescritura de marcas en diff3 (ruling) |
| 2 | Registros por id | done | — | |
| 3 | `sdd merge --sync` y el merge de sincronización de `sdd-archive` | done | — | RED a3c rojo; GREEN a3 2/2, a3n 1/1, a3c 1/1 (1,98 $) |
| 4 | Hotfix: etiqueta y vuelta antes de tocar nada | done | — | |
| 5 | Menores de código de la 0187 | pending | — | |

## Verificación por task

- [ ] Task 1 — `npx vitest run test/merge` (en `cli/`)
- [ ] Task 2 — `npx vitest run test/merge`
- [ ] Task 3 — `npx vitest run test/merge`; Pester de `WordBudget` y `ArchiveSkill`; batería `sdd-archive` (`a3c` RED; `a3`, `a3n`, `a3c` GREEN)
- [ ] Task 4 — `npx vitest run test/merge`
- [ ] Task 5 — `npx vitest run test/merge`

## Fixes adicionales

## Rulings
