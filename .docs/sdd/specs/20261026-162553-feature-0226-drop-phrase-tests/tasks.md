---
id: 20261026-162553-feature-0226-drop-phrase-tests
title: Tasks — Frases fuera y anatomía a Vitest
spec: ./spec.md
plan: ./plan.md
created: 2026-10-26
---

# Tasks — Frases fuera y anatomía a Vitest (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0226-drop-phrase-tests`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Lo útil a Vitest y los 57 Pester fuera | done | `99054c44` | RED por mutante en cada fichero nuevo |
| 2 | Las rutas nuevas en skills y documentos, y la ADR 0019 | done | `2ab881a9` | smoke de `git grep`: dos líneas antes, ninguna después |
| 3 | Enmienda 2026-10-26: `testInputs` a `/**/*` | done | (este commit) | la Task 1 queda afectada por enmienda 2026-10-26 → Task 3 |

## Verificación por task

- [x] Task 1 — `vitest run test/kit --exclude "**/*.slow.test.ts"` → 7 ficheros, 215 pasados y 12 saltados; `manifests.slow.test.ts` → 3 pasados; `moon run kit:test-fast` → 44 pasados, 0 fallos
- [x] Task 2 — smoke sin salida; `sdd decision check` → `Decisiones válidas`; `sdd roadmap check` → `Roadmap válido`

## Fixes adicionales

Ninguno.
