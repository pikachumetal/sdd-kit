---
id: 20261009-110857-feature-0160-single-entry-propose
title: Tasks — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica
spec: ./spec.md
plan: ./plan.md
created: 2026-10-09
---

# Tasks — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0160-single-entry-propose`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Batería de `sdd-propose` y RED de las reglas nuevas | done | `fb01b014` | RED 6 de 8 fallan; a3 y a4, control |
| 2 | `sdd-propose` nace con lo movido, sin cambiar reglas | done | `0490c649` | controles 7 de 7 en conducta |
| 3 | Entrada única: ceremonia asimétrica, carril de la petición, config y spike | done | `4fe7011d` | anuncio tras 4 rondas de REFACTOR; s2 del pato 1/2 |
| 4 | Estimación previa del patch | done | `6824eee8` | a2 2/2; la CLI no cambia |
| 5 | Gate del plan desde `operations.md` y topes finales | done | — | p2 2/2 |

## Verificación por task

- [ ] Task 1 — `bash -n` del `subject.sh`, `battery.mjs plan` y los Pester de rutas y privacidad
- [ ] Task 2 — Pester de anatomía, topes y frases movidas; controles GREEN
- [ ] Task 3 — Pester de anatomía, topes y enrutado; GREEN de `a1`, `a3`, `a4`, `k1`-`k4`, `p1`, `s2` y la batería de `using-sdd`
- [ ] Task 4 — Vitest de `cli/test/estimation`; GREEN de `a2`
- [ ] Task 5 — Pester de topes y plan; GREEN de `p2`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
