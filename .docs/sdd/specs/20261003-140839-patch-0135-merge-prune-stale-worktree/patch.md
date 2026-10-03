---
id: 20261003-140839-patch-0135-merge-prune-stale-worktree
task: 0135
title: Patch — Invoke-SddMerge.ps1 poda los worktrees registrados sin carpeta
type: patch
solution: causa raíz
status: done
created: 2026-10-03
branch: hotfix/v2.3.1
commit: 16b7a8d7
---

# Patch 0135 — Invoke-SddMerge.ps1 poda los worktrees registrados sin carpeta

## Capacidades

- Modificadas: `control-profiles` — cambia «Sin la rama destino sacada, el merge va en un worktree temporal junto a los demás»: un registro cuya carpeta ya no existe no cuenta como rama destino sacada, y el cierre no deja ninguno

## 1. Síntoma

Fila de deuda del roadmap «`Invoke-SddMerge.ps1` deja registrado un worktree temporal cuya carpeta ya no existe» (consulta del dev-lead, 2026-09-27): tras el merge del patch 0090, `git worktree list` seguía mostrando `merge-0090-config-dir-mold-guard` como *prunable*, con `develop` «sacada» ahí; GitKraken no podía cargar `develop` hasta un `git worktree prune`.

Medido sobre `main` (2.3.0), con el test nuevo de `tests/Invoke-SddMerge.Tests.ps1`: con `develop` registrada en un worktree `merge-0090` cuya carpeta ya no existe, el merge siguiente falla con `verificación: el hook rechazó el merge. fatal: cannot change to '…/wt/merge-0090': No such file or directory` —un mensaje que culpa al hook— y el registro sigue ahí.

**En qué difiere del reportado**: no se reprodujo cómo nace el registro. Una sonda con un proceso que retiene la carpeta del worktree temporal durante la retirada deja lo contrario (carpeta vacía sin registro, el caso del patch 0088, que el script ya limpia). El fallo medido es su consecuencia: el script nunca poda un registro sin carpeta, ni el que deja él ni uno anterior, y ese registro bloquea el merge siguiente.

## 2. Causa raíz

`skills/sdd-templates/scripts/Invoke-SddMerge.ps1`:

- `Remove-MergeWorktree` retira el temporal con `git worktree remove` (y `--force`) y borra la carpeta vacía sin registro, pero si la carpeta desaparece y el registro se queda, no lo quita: no hay ningún `git worktree prune`.
- `Resolve-DestinationWorktree` busca la rama destino en `git worktree list --porcelain` y acepta el registro sin carpeta como «rama destino sacada»: `git status` en esa ruta no devuelve nada (lo lee como limpio) y el merge se lanza en una carpeta que no existe.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`
  - `tests/Invoke-SddMerge.Tests.ps1`
  - `.docs/sdd/capabilities/control-profiles.md` (fusión del delta, en el cierre)
- **Cambio**: `git worktree prune` antes de buscar la rama destino y al final de `Remove-MergeWorktree`. `prune` solo quita registros cuya carpeta ya no existe (y respeta los bloqueados con `git worktree lock`), así que no toca ningún worktree vivo.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test nuevo antes del fix: `develop` registrada en `merge-0090` sin carpeta → fusiona y no queda nada *prunable* | ❌ como se esperaba: `fatal: cannot change to '…/merge-0090'` |
| 2 | sonda: proceso con la carpeta del temporal como directorio de trabajo durante la retirada | queda la carpeta vacía sin registro (caso del patch 0088), no un registro sin carpeta: el origen del reportado no se reproduce |
| 3 | `tests/Invoke-SddMerge.Tests.ps1` tras el fix | ✅ 23/23 |

Los casos los verificó el agente.

Validación en campo: 2026-10-03 · test nuevo en RED antes del fix y 23/23 tras él · pre-commit 949/0 · el origen del registro sin carpeta no se reprodujo (§1)

## 5. Tiempo (ligero)

- Real: 0,5h

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — Sin la rama destino sacada, el merge va en un worktree temporal junto a los demás**
- GIVEN un repo en el que `git worktree list` no muestra la rama destino sacada en ningún worktree
- WHEN el cierre fusiona
- THEN crea un worktree temporal de la rama destino en la carpeta que contiene el worktree de la feature, con nombre `merge-<id>`, fusiona allí y lo retira con `git worktree remove` antes de terminar
- AND el worktree de la feature sigue en su rama, el temporal no se crea en el scratchpad, en `%TEMP%` ni con `mktemp`, y ningún commit usa `--no-verify`
- AND un registro de worktree cuya carpeta ya no existe no cuenta como rama destino sacada: el cierre lo poda con `git worktree prune` antes de buscarla y otra vez al retirar el temporal, y no deja ninguno *prunable*
