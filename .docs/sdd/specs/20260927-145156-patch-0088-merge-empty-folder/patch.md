---
id: 20260927-145156-patch-0088-merge-empty-folder
task: 0088
title: Patch — una carpeta merge- vacía y huérfana ya no bloquea el merge del cierre
type: patch
status: done
created: 2026-09-27
branch: patch/0088-merge-empty-folder
commit: 675a3f1
---

# Patch 0088 — una carpeta merge- vacía y huérfana ya no bloquea el merge del cierre

## Capacidades

- Ninguna, porque el fix devuelve `Invoke-SddMerge.ps1` a lo que ya dice `control-profiles`: el worktree temporal se retira («Un merge del cierre que falla deja la rama destino como estaba») y tras un conflicto solo en los registros el script se relanza una vez y fusiona («Un conflicto solo en los registros se resuelve con un merge de sincronización»).

## 1. Síntoma

Reportado en el [ticket del patch 0084](../../field-reports/20260927-130155-patch-0084-headless-phase-mold.md) §2: tras un primer intento fallido con `merge: conflicto en .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md`, el relanzamiento que pide la receta falló con

```
destino sacado: ya existe 'D:\code\.worktrees\sdd-kit\merge-0084-headless-phase-mold'
```

La carpeta estaba vacía y no salía en `git worktree list`. El agente la borró a mano y el tercer intento fusionó. Decisión del dev-lead (2026-09-27): arreglarlo antes del corte de la 2.0.0.

## 2. Causa raíz

Reproducido en un repo desechable: un proceso con la carpeta del worktree como directorio actual (un handle abierto en Windows) y `git worktree remove` sobre ella.

- `git worktree remove` borra el contenido, no puede borrar la carpeta (`error: failed to delete '…/merge-x': Permission denied`, salida 255) y **quita el registro igual**.
- El reintento de `Remove-MergeWorktree` con `--force` falla con `fatal: '…\merge-x' is not a working tree` (salida 128), porque ya no hay registro.
- Queda una carpeta vacía y sin registrar. En el siguiente intento, la guarda `if (Test-Path -LiteralPath $path)` de `Resolve-DestinationWorktree` la trata igual que un worktree vivo y lanza `destino sacado: ya existe`.

El reportante sospechaba de un handle, sin reproducirlo; el experimento lo confirma. Quién tuvo el handle en su sesión (un indexador, un vigilante de ficheros) no se sabe, y no cambia el fix.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, `tests/Invoke-SddMerge.Tests.ps1`
- **Cambio**: nueva `Test-EmptyOrphanFolder` (existe, sin contenido y fuera de `git worktree list --porcelain`). La guarda de `Resolve-DestinationWorktree` borra esa carpeta y sigue; con contenido o registrada, falla como antes. `Remove-MergeWorktree` borra la carpeta si queda vacía y huérfana tras `worktree remove`; si el handle sigue abierto, no falla, y la guarda la limpia en el siguiente intento.
- El paso 7 de `merge-recipe.md` («Conflicto solo en los registros») no se toca: con el fix, el relanzamiento ya no choca con la carpeta y el texto vigente es correcto. Editarlo exigiría campaña RED→GREEN (Art. I) sin conducta nueva que medir.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: test nuevo «con una carpeta merge- vacía y sin registrar, la borra y fusiona» antes del fix | ❌ esperado: `destino sacado: ya existe '…\merge-0001'` (verificado por el agente) |
| 2 | Control: «con una carpeta merge- con contenido falla con destino sacado: y no la toca», antes y después del fix | ✅ en los dos (verificado por el agente) |
| 3 | GREEN: `tests/Invoke-SddMerge.Tests.ps1` completo tras el fix | ✅ 19/19 (verificado por el agente) |
| 4 | Suite rápida `Invoke-Pester -Path tests -ExcludeTagFilter Slow` | ✅ 722 pasan, 0 fallan (verificado por el agente) |

Validación diferida: 2026-09-27 · «Diferir: lo pruebo en el merge de este cierre, a cargo del dev-lead» · disparador: el merge de este cierre con `Invoke-SddMerge.ps1`, con la carpeta vacía `D:\code\.worktrees\sdd-kit\merge-0088-merge-empty-folder` creada antes

## 5. Tiempo (ligero)

- Real: 0,4 h
