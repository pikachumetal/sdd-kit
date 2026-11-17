---
id: 20260924-220915-patch-0065-merge-hook-rejection
task: 0065
title: Patch — Invoke-SddMerge.ps1 distingue el hook que rechaza el merge de un conflicto
type: patch
status: done
created: 2026-09-25
branch: feature/004-patch
commit: 771fda4
---

# Patch 0065 — Invoke-SddMerge.ps1 distingue el hook que rechaza el merge de un conflicto

## 1. Síntoma

Fila de deuda del roadmap «`Invoke-SddMerge.ps1` informa como “conflicto” cualquier fallo del merge» (task 0044, 2026-09-23): `Complete-MergeAttempt` lanza `merge: conflicto en <lista>` siempre que el merge sale con código distinto de 0. Si el hook `pre-merge-commit` lo bloquea (un test rojo), la lista sale vacía, el mensaje queda «merge: conflicto en .» y no enseña la salida del hook. El agente sigue la receta («un conflicto no se reintenta») por un conflicto que no existe.

Medido en el RED, con un `pre-merge-commit` que escribe `Tests Failed: 3` y sale con 1:

```text
merge: conflicto en .
```

Coincide con lo reportado.

## 2. Causa raíz

Hay dos causas en `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`:

- `Complete-MergeAttempt` solo distingue dos casos: el conflicto que está solo en `estimation-log.md` y cualquier otro código distinto de 0. Todo lo que no sea el primero termina en `throw "${StepName}: conflicto en …"`, también cuando `git diff --name-only --diff-filter=U` sale vacío. Un hook `pre-merge-commit` en rojo para el merge después de aplicar el árbol y antes del commit, así que no deja ningún fichero en conflicto.
- La salida del hook se pierde antes de llegar ahí. `Invoke-GitUtf8` ejecuta git con `2>$null`, y git manda a stderr la salida de sus hooks. Además, `Invoke-FeatureMerge` y `Sync-BaseBranch` descartan también stdout con `| Out-Null`.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, `tests/Invoke-SddMerge.Tests.ps1`.
- **Cambio**: `Invoke-GitUtf8` e `Invoke-IsolatedGit` aceptan `-KeepErrors`, que devuelve stdout y stderr juntos. Los dos merges (el de la base y el de la feature) lo usan y pasan esa salida a `Complete-MergeAttempt`. Si no hay ningún fichero en conflicto, ahora lanza `verificación: el hook rechazó el merge.` seguido de las últimas 20 líneas de la salida. Con ficheros en conflicto, el mensaje no cambia.
- `merge-recipe.md` no se toca: ya trata el prefijo `verificación:` («una `verificación:` en rojo… no se reintentan»), que es lo correcto para un hook en rojo.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: test nuevo «con el hook pre-merge-commit en rojo falla con verificación: y la salida del hook, no con conflicto», antes del fix | ✅ agente: falla con `merge: conflicto en .` |
| 2 | GREEN: el mismo test con el fix. Comprueba el mensaje, `Tests Failed: 3` en la salida, que no aparece «conflicto», `develop` local y remoto intactos, y la limpieza | ✅ agente: pasa |
| 3 | `tests/Invoke-SddMerge.Tests.ps1` completo, incluido «con otro conflicto falla con la lista de ficheros» | ✅ agente: 17/17 |
| 4 | Suite completa `Invoke-Pester tests` | ✅ agente: 604 pasan, 0 fallan |

## 5. Tiempo (ligero)

- Estimación: 0.5h (fila de deuda: patch)
- Real: 0.4 h
