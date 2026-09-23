---
id: 20260922-220001-patch-0035-ids-de-otras-ramas
task: 0035
title: Patch — Get-NextSddId.ps1 lee el roadmap y specs/ de todas las ramas
type: patch
status: done
created: 2026-09-22
branch: feature/next-id
commit: 1c052eb, 0a1ff14 (ampliación, rama feature/fix-01-2)
---

# Patch 0035 — Get-NextSddId.ps1 lee el roadmap y specs/ de todas las ramas

## 1. Síntoma

Del dev-lead: «en modo sequence colisiona cuando dos worktrees parten tasks en paralelo, porque solo ve el roadmap de su propia rama. Tercera colisión en dos días: la 0005 y la 0012 tomaron la 0019 y la 0020; la rama feature/0027; y hoy la 0019 iba a usar la 0031 y la 0032, ya reservadas en develop por la 0021 (lo frené yo a mano)». Detalle en la fila 0009 del roadmap.

Ampliación del dev-lead (2026-09-23): «además de las ramas, lee el roadmap.md del disco de cada worktree de `git worktree list`, porque una reserva puede estar en el índice sin commitear (ticket de la task 0019 §1: la 0021 tenía la 0031 y la 0032 en staged y ninguna rama las mostraba)».

## 2. Causa raíz

`Get-NextSddId.ps1` tomaba los ids de tres fuentes, y dos de ellas eran solo del working tree:

- `Get-SpecArtifactIds` listaba `.docs/sdd/specs/` del disco.
- `Get-RoadmapIds` leía `.docs/sdd/roadmap.md` del disco.
- `Get-BranchIds` recorría `git branch --all`, pero solo miraba el **nombre** de cada rama.

Una fila reservada en `develop`, o en otra rama `feature/*` sin fusionar, no aparece en el working tree de un worktree que partió antes. Tampoco aparece en el nombre de la rama: `72c1b76` reserva la 0031 y la 0032 en `develop`, que se llama `develop`. Además, la rama actual contaba como id ocupado, así que en `feature/0027` el script devolvía 0028 (ticket del patch 0027 §1, sin arreglar hasta ahora).

Evidencia en el repo real, con un worktree `--detach` en `02da87b^`, la base de la que partió la 0019: el script anterior devuelve `0031`, que ya estaba reservado en `develop`.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Get-NextSddId.ps1`, `tests/Get-NextSddId.Tests.ps1`
- **Cambio**: por cada rama de `git branch --all`, el script lee también su roadmap (`git show <rama>:.docs/sdd/roadmap.md`) y sus carpetas de `specs/` (`git ls-tree -d --name-only`, con `core.quotePath=false` para las tildes), y devuelve el máximo más uno. Lee todas las ramas, no solo la de integración y las `feature/*`: así cubre `develop`, la que declare `merge.into` de `sdd-kit.json` y los `hotfix/*` sin leer la configuración, y también la fila reservada en otra `feature/*` sin fusionar, que es el caso de la 0005 y la 0012. Si la rama actual lleva id (`feature/<id>`) y ese id no aparece en ningún otro sitio, lo devuelve como el id de la sesión. Su rama de seguimiento `origin/<rama>` no cuenta como otra rama. La comprobación de carpetas duplicadas sigue mirando solo el working tree: una rama vieja con una carpeta renombrada no bloquea el script.
- **Ampliación**: lee además el `roadmap.md` del disco de cada worktree de `git worktree list --porcelain`. Una fila en *staged* o sin añadir al índice no está en ninguna rama; solo en el árbol de trabajo de su worktree. El worktree bare y los que ya no existen en disco no tienen roadmap y no cuentan.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: 5 tests nuevos antes del fix | ✅ agente: fallan 4 (0006 en vez de 0032, 0020 y 0013; 0028 en vez de 0027); el quinto, id de la rama ya usado en otra rama, pasa también antes |
| 2 | GREEN: `tests/Get-NextSddId.Tests.ps1`, con dos ramas desde la misma base y una fila reservada sin fusionar, en rutas con tildes | ✅ agente: 22 pasan, 0 fallan |
| 3 | Colisión real de la 0019: worktree `--detach` en `02da87b^` | ✅ agente: script anterior `0031`, script nuevo `0035` |
| 4 | El script sobre este worktree (`feature/next-id`, sin id en el nombre) | ✅ agente: `0035`, el id de este patch |
| 5 | Suite completa `Invoke-Pester -Path tests` | ✅ agente: 321 pasan, 0 fallan, 6 skipped |
| 6 | Ampliación, RED: otro worktree con `\| 0032 \|` añadida al roadmap y solo en *staged* | ✅ agente: falla, `0006` en vez de `0033` |
| 7 | Ampliación, GREEN: `tests/Get-NextSddId.Tests.ps1` | ✅ agente: 23 pasan, 0 fallan |
| 8 | Ampliación: el script sobre este worktree (`feature/fix-01-2`, repo bare con cuatro worktrees) | ✅ agente: `0036` |
| 9 | Ampliación: suite completa `Invoke-Pester -Path tests` | ✅ agente: 353 pasan, 0 fallan, 6 skipped |

## 5. Tiempo (ligero)

- Estimación: sin estimación
- Real: 0,75h (0,5h del patch y 0,25h de la ampliación)
