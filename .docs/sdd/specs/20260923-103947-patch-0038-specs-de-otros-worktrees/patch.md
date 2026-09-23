---
id: 20260923-103947-patch-0038-specs-de-otros-worktrees
task: 0038
title: Patch — Get-NextSddId cuenta las carpetas de specs/ sin commitear de otros worktrees
type: patch
status: done
created: 2026-09-23
branch: feature/0038
commit: <hash>
---

# Patch 0038 — Get-NextSddId cuenta las carpetas de specs/ sin commitear de otros worktrees

## 1. Síntoma

Del dev-lead: «Get-WorktreeRoadmapIds lee del disco de cada worktree el roadmap, pero no los nombres de carpeta de .docs/sdd/specs/, y un patch reserva su id con la carpeta, no con una fila. Cuarta colisión: el patch 0036 creó su carpeta sin commitear, la 0006 se partió y reservó la 0036 en develop, y el patch tuvo que renumerarse a 0037 (ticket del patch 0037 §1).»

## 2. Causa raíz

- `skills/sdd-templates/scripts/Get-NextSddId.ps1`, `Get-WorktreeRoadmapIds` (antes del fix): recorre `git worktree list --porcelain` y de cada worktree solo llama a `Get-RoadmapIds`. Las carpetas de `specs/` se leen del disco solo en el worktree propio (`Get-SpecArtifactIds $ProjectRoot`) y, en los demás, solo si están commiteadas en su rama (`Get-BranchContentIds`, vía `git ls-tree`).
- Un patch no tiene fila en el roadmap hasta el cierre: su única reserva mientras trabaja es la carpeta sin commitear. Ningún camino del script la veía desde otro worktree.
- Evidencia: el test nuevo falla con el script sin fix (`Expected: '0037'  But was: '0006'`).

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Get-NextSddId.ps1`, `tests/Get-NextSddId.Tests.ps1`
- **Cambio**: la función pasa a `Get-WorktreeDiskIds` y, en el mismo bucle, suma a las filas del roadmap los ids de las carpetas de `specs/` de cada worktree (reutiliza `Get-SpecArtifactIds`). El test crea el worktree A con `specs/20260923-070206-patch-0036-disparador/` sin commitear ni fila, y el worktree B recibe 0037.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: test nuevo con el script sin fix | ✅ agente: falla con `But was: '0006'` |
| 2 | GREEN: `tests/Get-NextSddId.Tests.ps1` con el fix | ✅ agente: 24 pasan, 0 fallan |
| 3 | Suite completa `Invoke-Pester -Path tests` | ✅ agente: 357 pasan, 0 fallan, 6 skipped |
| 4 | En este repo, con la carpeta del patch 0038 creada | ✅ agente: el script devuelve 0039 |

## 5. Tiempo (ligero)

- Estimación: 0,3h
- Real: 0,2h
