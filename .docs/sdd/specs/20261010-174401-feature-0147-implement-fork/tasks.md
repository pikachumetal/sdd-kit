---
id: 20261010-174401-feature-0147-implement-fork
title: Tasks — implement: sdd-implement y el decálogo de calidad
spec: ./spec.md
plan: ./plan.md
created: 2026-10-10
---

# Tasks — implement: `sdd-implement` y el decálogo de calidad (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0147-implement-fork`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Batería de `sdd-implement` y RED de las reglas nuevas | done | 3237410b | r1 limpio → r1b, por decisión del dev-lead |
| 2 | `sdd-implement` nace con lo movido, sin cambiar reglas | done | 4597d47e | traspaso del paso 6 reforzado tras `u1`/`u2` 0/4 → 4/4 |
| 3 | Reglas nuevas de implement | done | 31783aa5 | anuncio del workspace 3/6: a deuda |
| 4 | Piezas de la 0007, filas del roadmap y topes finales | done | af51d93d | r5 2/2; r2, r3 y commits por ruta a deuda |

## Verificación por task

- [x] Task 1 — `bash -n tests/batteries/sdd-implement/subject.sh` y `battery.mjs field … r1 Petición`
- [x] Task 2 — Pester `ImplementSkill`, `Skills`, `WordBudget` y GREEN de `u1`, `u2`
- [x] Task 3 — Pester y GREEN de `r1b`, `r4`, `h1`, `h2`
- [x] Task 4 — Pester, `roadmap check` y GREEN de `r5` (la única pieza de la 0007 que falla en RED)

## Revisión

Revisión final: general-purpose + opus, With fixes, sobre ee434576
Pasada de fix: 57ca443d, 1 Important RED→GREEN (más la enmienda de la spec y siete minors)

## Rulings

- Task 2: Ruling: el Pester de forma ImplementSkill.Tests.ps1 pasa a la primera — sdd-implement se escribió mientras corría el RED de la Task 1, así que su rojo no se observó — si el test tiene un hueco, lo verá la revisión final
- Task 4: Ruling: tech-stack.md no se toca — la fidelidad del molde al estado del repo ya está en su aprendizaje de la task 0029 — si faltara, otra fila de deuda
- Final: Ruling: los siete minors baratos entran en la misma pasada — cada uno es una línea y tres tienen Pester — la regla de Native los manda al ledger: me salté la regla, coste si está mal: ninguno en conducta

## Fixes adicionales

Ninguno.
