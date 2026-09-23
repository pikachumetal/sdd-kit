# Receta del merge en el cierre

La usan el paso 10 de `sdd-end-task` y el paso 6 de `sdd-end-patch` cuando la política de merge ya dijo que se fusiona: la aplica el agente (bloque `merge` completo, perfil `delegate` o `unattended`) o el usuario la pidió. Qué se fusiona y cómo lo fija la política: la rama destino es `merge.into`, y el merge va con `--no-ff` si `merge.noFf` es `true`.

## Cuándo

`git worktree list` dice si la rama destino está sacada en algún worktree:

- **Sacada**: se fusiona en ese worktree, como pide `superpowers:finishing-a-development-branch`. De esta receta valen entonces «Conflicto en estimation-log.md» y «Merge denegado por el entorno».
- **Sin sacar en ninguno** (repo bare con un worktree por rama, el caso normal con worktrees): sigue esta receta **en lugar de la opción 1 de `finishing-a-development-branch`**. Esa opción hace `cd` a la raíz del repo principal y `git checkout <destino>`, y en un repo bare esa raíz no es un working tree: falla con `fatal: not a git repository`.

## Worktree temporal

1. Carpeta: la que contiene el worktree de la feature, es decir, el directorio padre de `git rev-parse --show-toplevel`. Ahí viven los demás worktrees, con rutas cortas. Nombre: `merge-<id>`, con el id de la task o del patch.
2. `git worktree add <carpeta>/merge-<id> <destino>`.

Nunca:

- en el scratchpad, en `%TEMP%` o `/tmp`, ni con `mktemp`: rutas largas (`Filename too long` en Windows) y fuera de la vista de quien lista los worktrees;
- junto al repo bare si los worktrees viven en otra carpeta;
- `git checkout <destino>` o `git switch <destino>` en el worktree de la feature: la feature sigue en su rama.

## Merge

En el worktree temporal: `git merge --no-ff <rama de la feature>` si `merge.noFf` es `true`; sin la opción si es `false`. Con los hooks activos: nunca `--no-verify`.

## Conflicto en estimation-log.md

`estimation-log.md` es un fichero generado. Con conflicto, se regenera en el worktree temporal con el script del kit y se marca resuelto; nunca se edita a mano:

```text
pwsh -NoProfile -File "<Base directory de la skill de cierre>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root "<worktree temporal>"
git add .docs/sdd/estimation-log.md
```

Es el mismo script que ya ejecutó el paso del estimation-log del cierre.

## Suite y retirada

1. La suite del proyecto sobre el resultado del merge, en el worktree temporal, como pide `finishing-a-development-branch` («Verify tests on merged result»). Si falla, para: el merge es local, y el worktree y la rama de la feature se quedan como están.
2. En verde: `git worktree remove <carpeta>/merge-<id>`, nunca `rm -rf`. El worktree de la feature lo decide `merge.removeWorktree`, no esta receta.

## Merge denegado por el entorno

La política autoriza el merge y el entorno lo deniega (un clasificador del harness, un hook). No se reintenta con otra herramienta ni con otra forma del comando: lo desbloquea una persona. El informe final dice:

1. El **comando** denegado, literal, en un bloque de código.
2. El **texto de la denegación**, citado.
3. El **hash** de la rama destino, que sigue sin tocar (`git rev-parse --short <destino>`). Si al volver a mirarlo ha cambiado, otra sesión fusionó en ese rato: dilo.
4. Que el resto del cierre está hecho, y qué queda: solo el merge.

Si el worktree temporal llegó a crearse, se retira igual (`git worktree remove`).
