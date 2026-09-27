---
id: 20260927-124029-patch-0083-rename-leftovers
task: 0083
title: Patch — restos del renombrado de la 0064
type: patch
status: done
created: 2026-09-27
branch: patch/0083-rename-leftovers
commit: <hash>
---

# Patch 0083 — restos del renombrado de la 0064

## Capacidades

- Ninguna, porque el patch renombra los ficheros `task-flow` y `task-ids` sin cambiar ningún requisito

## 1. Síntoma

Reportado (dev-lead, 2026-09-27, antes del corte de la 2.0.0): dos filas de «Deuda técnica» del roadmap.

1. «`sdd-end-release` nombra `sdd-start-release`»: la línea 11 de la skill dice «haya habido apertura con `sdd-start-release` o no», y la 0062 retiró esa skill.
2. «Slugs `task-flow` y `task-ids` de `capabilities/`»: la unidad se llama feature desde la 0064, pero las dos capacidades conservan el slug viejo.

## 2. Causa raíz

- **Mención**: la línea es de la 0063 y la 0062 retiró la skill después. El test que vigila la retirada (`tests/PlanEntry.Tests.ps1`, «Retirada de sdd-start-release») listaba `skills/sdd-end-release/SKILL.md` como mención permitida, «que es de otra task». Por eso nada falló.
- **Slugs**: la decisión 9 de la spec de la 0064 los dejó así, porque el delta no sabe renombrar un fichero. El único enlace vivo es `release-flow.md:13`, que apunta a `task-ids.md`. Ninguna skill ni script nombra los dos slugs. Las specs cerradas, los field reports, el changelog y la evidencia de `tests/*.md` son histórico y conservan el nombre viejo (tech-stack T19 (3)).

## 3. Fix

- **Fichero(s)**: `skills/sdd-end-release/SKILL.md`, `.docs/sdd/capabilities/{feature-flow,feature-ids,release-flow}.md`, `.docs/sdd/roadmap.md` (mención de `task-flow` en la fila de los menores de la 0070), `tests/PlanEntry.Tests.ps1`, `tests/FeatureRename.Tests.ps1`.
- **Cambio**: la frase del Overview ya no nombra la skill retirada. `git mv` de `task-flow.md` a `feature-flow.md` y de `task-ids.md` a `feature-ids.md`, con el título `# Capacidad — <slug>` y el enlace de `release-flow.md` al día.

## 4. Verificación

RED mecánico, sin sujetos (tech-stack T19 (2)): el test de la retirada ya solo permite la migración v1.2.0, y un Context nuevo de `FeatureRename.Tests.ps1` exige los slugs de feature con su título, que no existan los viejos y que ninguna capacidad los enlace.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `FeatureRename` + `PlanEntry` sobre la base | ✅ 6 fallos, los esperados: dos títulos, dos ficheros viejos, el enlace de `release-flow.md` y la mención de `sdd-end-release` |
| 2 | GREEN: suite entera | ✅ 931/1. El fallo es `FastSuiteBudget`, que mide tiempo y excede el umbral por la carga de la suite entera; aislado pasa (29 s) |
| 3 | `Test-Capabilities.ps1 -Path .docs/sdd` y `Get-CapabilityIndex.ps1` | ✅ 14 válidas; el índice lista `feature-flow` y `feature-ids` |

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Real: 0,3 h
