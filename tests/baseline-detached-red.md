# RED — la línea base corre en el árbol de la rama (feature 0246, Task 1)

Escenario `w2` de la batería de `sdd-implement` (paso `worktree-baseline`): la 0010 abierta en un worktree enlazado, con `env:setup`, `Gate de cierre: node --test` y, sin commitear, `test/rooms-half.test.js`, el RED de la Task 1 a medio escribir. Kit: `git archive` del commit de apertura `40c72058` (texto de `sdd-worktrees` sin tocar). Sonnet, n = 2, 0,73 $. Salidas en `.docs/sdd/specs/20261029-190601-feature-0246-baseline-detached-worktree/red/out/`.

## Veredicto por la fila `Wb`

| Sujeto | Dónde corrió la línea base | Orden | `Wb` |
| --- | --- | --- | --- |
| `w2-1` | el árbol de la rama (`wt`) | `node --test`: 4/5, rojo en `test/rooms-half.test.js` («truncado: error de sintaxis»); lo da por RED del dev-lead | falla |
| `w2-2` | el árbol de la rama (`wt`) | `node --test test/app.test.js test/cancel.test.js`: 4/4; «No he corrido `node --test` entero porque recogería tu RED a medias» | falla |

0/2. Ninguno creó un worktree desanclado: el primero corrió el gate sobre los ficheros a medio escribir, el caso de la 0238, y lo salvó leyendo el error; el segundo esquivó el rojo cambiando la orden del gate por una lista de ficheros escrita a mano, que no es el gate de cierre. Los dos dejaron `## worktrees` solo con `develop` y la rama, y los dos ejecutaron `env:setup` en el worktree de la rama (conducta vecina, se cumple).

## Ruido del molde

Los dos sujetos señalaron que `rooms-half.test.js` espera «cancelada Norte lun — sala ocupada» y la spec dice «cancelada Norte lun (sala ocupada)». No toca la fila `Wb`; para el GREEN, el fixture lleva el literal de la spec.
