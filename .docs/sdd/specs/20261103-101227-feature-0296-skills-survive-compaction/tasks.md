---
id: 20261103-101227-feature-0296-skills-survive-compaction
title: Tasks — sdd-implement partida en una puerta propia y dos copias de superpowers
spec: ./spec.md
plan: ./plan.md
created: 2026-11-05
---

# Tasks — sdd-implement partida en una puerta propia y dos copias de superpowers (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0296-implement-gate-and-copies`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd-implement-native`, copia anotada de `executing-plans` | done | — | |
| 2 | `sdd-implement-subagent`, copia anotada de `subagent-driven-development` | pending | — | |
| 3 | La puerta `sdd-implement`, propia | pending | — | |
| 4 | El freno de la spec y la parada sobre una copia | pending | — | |
| 5 | Humos, enrutado y documentos | pending | — | |

## Verificación por task

- [ ] Task 1 — `pnpm --dir cli exec vitest run test/kit/skills.test.ts test/kit/notices.test.ts test/kit/word-budget.test.ts test/kit/dist.test.ts`
- [ ] Task 2 — los mismos cuatro
- [ ] Task 3 — los cuatro más `test/kit/skills-readers.test.ts`
- [ ] Task 4 — `test/kit/skills.test.ts test/kit/dist.test.ts`
- [ ] Task 5 — `test/kit/skills.test.ts test/kit/workflow-docs.test.ts test/kit/word-budget.test.ts`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Task 1: docs-claims.test.ts mira las líneas de marca | el test lee skills/ con las marcas, que citan los scripts que sustituyen y no viajan a dist/ | arreglado en la task: salta las líneas de marca con WHOLE_LINE_MARK, como skills.test.ts | (este commit) |

## Rulings

_Ninguno_
