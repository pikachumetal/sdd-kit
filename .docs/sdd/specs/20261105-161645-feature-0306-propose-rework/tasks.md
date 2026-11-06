---
id: 20261105-161645-feature-0306-propose-rework
title: Tasks — sdd-propose rehecha, con sus references/ como copia o propia
spec: ./spec.md
plan: ./plan.md
created: 2026-11-05
---

# Tasks — sdd-propose rehecha, con sus references/ como copia o propia (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0306-propose-rework`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La rúbrica de review en inglés, con dos revisores por defecto, el de lite y patch, y la segunda ronda | done | 8f6357c1 | afectada por enmienda 2026-11-05 → Task 6 |
| 2 | `spec-writing.md` y `plan-writing.md` propias, con las frases de `brainstorming` 7.0.2 y las secciones al ✋ en `delegate` | done | e285544c | afectada por enmienda 2026-11-05 → Task 6 |
| 3 | `control-profiles.md`, `modo-lite.md` y `nombrado.md` en inglés | done | 5a688d75 | |
| 4 | `SKILL.md` por debajo de 20.000 bytes, con el repaso de coherencia nuevo | done | b783a4f5 | con lo de la enmienda 2026-11-05 que cae en sus ficheros |
| 5 | Batería entera de control, REFACTOR y evidencia | done | (este commit) | REFACTOR del idioma en el Overview del `SKILL.md`; fixtures de `rv2` y `lr1` rehechas |
| 6 | Task 6 — enmienda 2026-11-05: los recuentos del repaso y los enfoques al ✋ en `delegate` | done | 55360eb7 | |

## Verificación por task

- [x] Task 1 — los comandos de su campo «Verificación» del plan
- [x] Task 2 — los comandos de su campo «Verificación» del plan
- [x] Task 3 — los comandos de su campo «Verificación» del plan
- [x] Task 4 — los comandos de su campo «Verificación» del plan
- [x] Task 5 — los comandos de su campo «Verificación» del plan, más la lenta

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

_Ninguno_
