---
id: 20261103-201153-feature-0302-annotated-copies
title: Tasks — Las copias anotadas contra su fuente
spec: ./spec.md
plan: ./plan.md
created: 2026-11-03
---

# Tasks — Las copias anotadas contra su fuente (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0302-annotated-copies`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La marca y las comprobaciones puras | done | — | |
| 2 | El registro fichero a fichero | done | — | |
| 3 | `kit:copies` contra los clones | done | — | afectada por enmienda 2026-11-03 → Task 5 |
| 4 | `kit:copies-update` y el experimento de 7.0.0 a 7.0.1 | done | — | |
| 5 | Enmienda 2026-11-03: marcas dentro de una valla | pending | — | |

## Verificación por task

- [x] Task 1 — `pnpm --dir cli exec vitest run test/kit/copies.test.ts test/kit/dist.test.ts`
- [x] Task 2 — `pnpm --dir cli exec vitest run test/kit/notices.test.ts test/kit/dist.test.ts test/kit/word-budget.test.ts` y `test/kit/upstream-watch.slow.test.ts`
- [x] Task 3 — `pnpm --dir cli exec vitest run test/kit/copies.slow.test.ts` y `moon run kit:copies`
- [x] Task 4 — `pnpm --dir cli exec vitest run test/kit/copies.test.ts test/kit/copies.slow.test.ts`
- [ ] Task 5 — `pnpm --dir cli exec vitest run test/kit/dist.test.ts test/kit/copies.test.ts`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

_Ninguno_
