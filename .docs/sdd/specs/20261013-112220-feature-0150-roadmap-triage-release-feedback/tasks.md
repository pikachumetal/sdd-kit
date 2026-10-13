---
id: 20261013-112220-feature-0150-roadmap-triage-release-feedback
title: Tasks — Roadmap Now / Next / Later y debt.md con triaje
spec: ./spec.md
plan: ./plan.md
created: 2026-10-13
---

# Tasks — Roadmap Now / Next / Later y debt.md con triaje (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0150-roadmap-triage-release-feedback`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | RED: moldes, escenarios y baseline | done | `f790e67c` | m3b y su RED en `d50c8cd3`; enmiendas de la spec tras el RED en `0809c953` |
| 2 | Plantillas: `ROADMAP.md`, `debt.md`, «Fuente» y el carril del prompt | pending | — | |
| 3 | `sdd roadmap check`: `ROADMAP.md` 3.0.0, `debt.md` y sin aviso del «Destino» | pending | — | |
| 4 | `sdd-roadmap` en inglés: forma 3.0.0, equivalencias 2.x, prompt desde el brief y triaje | pending | — | |
| 5 | `sdd-feedback` en inglés, con la fuente de cada dato | pending | — | |

## Verificación por task

- [ ] Task 1 — los tres `DRY_RUN=1` y la campaña RED (verificación lenta)
- [ ] Task 2 — `moon run kit:test-fast`
- [ ] Task 3 — `moon run cli:typecheck cli:test kit:roadmap` y `roadmap check` sobre este repo
- [ ] Task 4 — `moon run kit:test-fast` y la campaña GREEN (verificación lenta)
- [ ] Task 5 — `moon run kit:test-fast` y el GREEN de fb1 (verificación lenta)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
