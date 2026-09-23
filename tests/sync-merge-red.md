# RED — merge de sincronización ante un conflicto solo en los registros (task 0039)

Baseline **estructural y de campo**, sin sujetos nuevos (coste cero). La receta vigente manda parar ante cualquier conflicto de `merge:`, y un cierre real paró exactamente así. Método permitido en `tech-stack.md` («verificación leída con fichero y línea si es estructural» y «La rama de una task ya fusionada es un RED a coste cero»).

## R1 — La receta manda parar ante todo conflicto de `merge:`

`skills/sdd-end-task/references/merge-recipe.md:43` (kit en `682913d`), §«Si el script falla»:

> Un conflicto de `merge:`, una `verificación:` en rojo o un `cerrojo:` agotado no se reintentan: los resuelve una persona.

No distingue entre un conflicto en código y uno en los registros de solo añadir. El paso 10 de `sdd-end-task` y el paso 6 de `sdd-end-patch` añaden «Nunca `git merge`, `git pull`, `git push` ni `HEAD:<destino>` a mano», así que un agente que sigue la skill no tiene camino para integrar la base en la feature.

## R2 — El script solo resuelve el log cuando va solo

`skills/sdd-templates/scripts/Invoke-SddMerge.ps1:208`, en `Complete-MergeAttempt`:

```powershell
if ($conflicted.Count -eq 1 -and $conflicted[0] -match 'sdd/estimation-log\.md$') {
```

Con el log junto al changelog o al roadmap, aborta y falla con la lista completa.

## R3 — Campo: el cierre de la 0044 paró por los tres registros

[Ticket 0044 §1](../.docs/sdd/field-reports/20260923-202119-task-0044-commit-per-milestone.md): con la 0016 fusionada en `develop` mientras corría la task, `Invoke-SddMerge.ps1` falló con

```text
merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.
```

El agente siguió la receta: dejó la task «No terminado» y paró a preguntar al dev-lead (1 de 1). Tras su decisión, la resolución a mano quedó en la historia de `develop`:

```text
e920e0a 50abfa0 50dd062 | merge: integrar develop (task 0016) en el cierre de la 0044
    # Conflicts: .docs/sdd/changelog.md · .docs/sdd/estimation-log.md · .docs/sdd/roadmap.md
682913d 50dd062 cb1123c | merge: feature/0044 en develop
```

Es la forma que propone el ticket: un merge de sincronización después del commit de cierre (`50abfa0`) y el script relanzado. Costó una parada del dev-lead por un conflicto mecánico.

## Veredicto

Falla 1/1 en campo, y la causa es estructural (R1 y R2): la receta no deja otra salida. Se escribe la guidance.
