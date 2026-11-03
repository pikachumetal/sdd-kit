---
id: 20261103-173149-feature-0300-skill-source-build-dist
title: Tasks — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit
spec: ./spec.md
plan: ./plan.md
created: 2026-11-03
---

# Tasks — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0300-skill-source-build-dist`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Build, `dist/` y marketplace | done | — | |
| 2 | La sesión de desarrollo y la copia para sujetos desde `dist/` | pending | — | |
| 3 | El registro de fuentes y los avisos generados | pending | — | |
| 4 | Prueba de instalación, byte a byte y glosario | pending | — | |

## Verificación por task

- [ ] Task 1 — `vitest run test/kit/dist.test.ts test/kit/skill-size.test.ts test/kit/path-length.test.ts`, `dist.slow.test.ts`, `moon run kit:build kit:skill-size`, `cli:typecheck`
- [ ] Task 2 — `kit-session-source.slow.test.ts`, `moon run kit:test-headless`, `manifests.slow.test.ts`, el `rg` de la spec y el fallo de build a mano
- [ ] Task 3 — `notices.test.ts`, `dist.test.ts`, `upstream-watch.slow.test.ts`, `moon run kit:upstream`
- [ ] Task 4 — `install.mjs` y la comparación byte a byte

## Fixes adicionales

Ninguno.
