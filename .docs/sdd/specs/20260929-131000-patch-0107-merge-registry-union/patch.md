---
id: 20260929-131000-patch-0107-merge-registry-union
task: 0107
title: Patch — Invoke-SddMerge.ps1 une dentro del cerrojo los registros que solo añaden líneas
type: patch
status: done
created: 2026-09-29
branch: feature/0107-merge-registry-union
commit: <hash>
---

# Patch 0107 — Invoke-SddMerge.ps1 une dentro del cerrojo los registros que solo añaden líneas

## Capacidades

- Modificadas: `control-profiles` — el merge del cierre resuelve él mismo los conflictos de los registros que solo añaden líneas por los dos lados

## 1. Síntoma

Fila de deuda «La cola del merge no cubre la resolución del conflicto en los registros» (tickets de los patches [0102](../../field-reports/20260929-115534-patch-0102-subject-git-user-clean.md), [0104](../../field-reports/20260929-115535-patch-0104-next-id-legacy-suffix.md), [0105](../../field-reports/20260929-120248-patch-0105-capabilities-delta-applied.md) y [0106](../../field-reports/20260929-115542-patch-0106-session-tokens-tests-isolation.md) §1, 2026-09-29): 4 de 6 cierres en paralelo acabaron en «No terminado». Los tickets lo atribuyen a que `Invoke-SddMerge.ps1` suelta el cerrojo al chocar en `roadmap.md`, `changelog.md` o `estimation-log.md`, la sincronización de la receta se hace fuera del cerrojo y el único reintento vuelve a chocar.

Reproducido en Pester antes del fix: dos ramas desde la misma `develop` que añaden una fila a `## Patches`, una línea a `### Fixed` y un `patch.md`. La primera se fusiona; la segunda falla con:

```text
merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.
```

## 2. Causa raíz

`Complete-MergeAttempt` solo resolvía un conflicto si era **el único** fichero y ese fichero era `estimation-log.md` (`Invoke-SddMerge.ps1:144` antes del fix). Con `roadmap.md` o `changelog.md` en la lista, abortaba el merge y lanzaba `merge: conflicto en`; el `finally` soltaba el cerrojo. La resolución quedaba en manos de la receta (`merge-recipe.md`, «Conflicto solo en los registros»), que la hace en el worktree de la feature, ya **fuera** del cerrojo: mientras tanto otra sesión fusiona, la rama destino vuelve a avanzar con otra fila en el mismo sitio y el único relanzamiento choca otra vez. La hipótesis de los tickets queda confirmada en el script; la parte de la receta se confirma por su texto (pasos 2 y 7).

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, `tests/Invoke-SddMerge.Tests.ps1`
- **Cambio**: con conflictos solo en los tres registros, el script rehace `roadmap.md` y `changelog.md` con `git checkout --conflict=diff3`. Si todos los trozos tienen la sección de la base vacía (solo añaden por los dos lados), toma la unión: primero las líneas de la rama destino, después las de la rama. Regenera `estimation-log.md` con `Build-EstimationLog.ps1` y commitea el merge, todo dentro del cerrojo y en el mismo worktree. Si un trozo toca una línea de la base, aborta y falla con `merge: conflicto en` como antes. Vale igual para el paso `base:`.

Fuera de alcance, como pedía la fila: la variante del ticket 0105 que resuelve celdas modificadas en filas contiguas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Test «une las filas y líneas que dos ramas añaden a los registros», antes del fix | ❌ `merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.` (reproducido) |
| 2 | El mismo test tras el fix: las dos filas y las dos líneas en orden, el log con los dos patches, sin marcadores, local y remoto iguales | ✅ |
| 3 | Test «si las dos ramas cambian la misma fila de un registro falla con merge: conflicto en» (antes y después), con `develop` intacta en local y en el remoto | ✅ |
| 4 | `Invoke-Pester tests/Invoke-SddMerge.Tests.ps1` completo | ✅ 21/21 |

Lo verificó el agente; el dev-lead no lo ha probado todavía.

## 5. Tiempo (ligero)

- Real: 0,4 h

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — El merge del cierre parte de la rama destino publicada**
- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- AND si los únicos conflictos son de `changelog.md`, `roadmap.md` o `estimation-log.md` y en los dos primeros cada trozo solo añade líneas por los dos lados, los une (primero la rama destino) y regenera `estimation-log.md` con `Build-EstimationLog.ps1`; con cualquier otro conflicto, falla con la lista de ficheros

**ADDED — El merge del cierre une los registros que solo añaden líneas**
- GIVEN dos ramas desde la misma rama destino que añaden cada una una fila a `roadmap.md` y una línea a `changelog.md` en el mismo sitio, y la primera ya se ha fusionado
- WHEN el cierre de la segunda ejecuta `Invoke-SddMerge.ps1`
- THEN el script resuelve el conflicto dentro del cerrojo, en su worktree: deja las líneas de la rama destino y después las de la rama, regenera `estimation-log.md` y fusiona sin intervención
- AND si en algún trozo los dos lados cambian una línea que ya existía, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino
