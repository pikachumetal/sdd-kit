# Un commit por hito

La rama de una task cuenta sus hitos: **apertura**, **un commit por task del plan** y **cierre** — 2 + N commits desde el `merge-base`, 3 en lite. La de un patch, dos: **fix** y **cierre**. Mientras un hito está abierto se commitea lo que haga falta: la revisión de `subagent-driven-development` trabaja por rangos `BASE..HEAD`. Cuando la revisión del hito queda limpia, su rango se junta en un commit.

## Qué lleva cada hito

| Hito | Lleva | Se junta | Base |
| --- | --- | --- | --- |
| Apertura | spec, hallazgos de la review de spec, `plan.md`, `tasks.md` (lite: solo la spec) | antes de escribir los RED de la primera task (en Native, antes de su `task-start`); lite: antes de implementar | `git merge-base HEAD <integración>` |
| Task N | sus tests RED, su implementación, los arreglos de su revisión, su evidencia | con su revisión (y re-revisión) limpia, antes de despachar la siguiente o la revisión final; en Native, con su contrato de cierre cumplido y antes de `task-done` | el `BASE` que apuntaste antes de despacharla (en Native, el que imprime `task-start`) |
| Cierre | documentación de `sdd-end-task`, arreglos de la revisión final de rama y de la validación | tras la documentación de cierre, antes del merge | el commit de la última task |
| Fix (patch) | código, tests y `patch.md` | con el fix verificado | `git merge-base HEAD <integración>` |
| Cierre (patch) | `patch.md` con hash y tiempo, changelog, roadmap, estimation-log | antes del merge | el commit del fix |
| Merge de sincronización | la rama destino integrada en la feature, con los registros resueltos | no se junta | — |

Si el dev-lead fija otra forma de commits («tres commits en orden»), manda la suya sobre «un solo commit» y el hito no se junta. Un test en RED va en el commit de su arreglo o en uno posterior, nunca antes: un `pre-commit` que corre la suite lo rechaza, y sin él la rama llevaría un commit en rojo. El RED queda registrado en `patch.md` §4 (en una task, en su evidencia). Sin `--no-verify` (ticket del patch 0072 §2).

El merge de sincronización solo lo pide la [receta del merge](../../sdd-end-task/references/merge-recipe.md#conflicto-solo-en-los-registros); va después del commit de cierre y es el último commit de la rama, así que la historia queda en 2 + N (2 en un patch) más ese merge, y el cierre no se vuelve a juntar.

## Receta

Primero las dos guardas (siguiente sección). Si ninguna salta:

```bash
git reset --soft <base>
git commit        # convención de commits del proyecto
```

La receta vale también con un solo commit en el rango: el mensaje del hito lo escribes tú con la convención del proyecto, nunca se hereda del implementador, porque el paquete de la revisión de task muestra el asunto y no el cuerpo. Medido en `tests/native-adapt-red.md`: con «un solo commit, nada que juntar», 2 de 2 sujetos dejaron en la rama un cuerpo sin tildes. Nunca `rebase -i`, `push --force` ni `--no-verify`.

## Guardas

No se junta, y no se hace push forzado, si:

- el rango contiene un merge: `git rev-list --merges <base>..HEAD` no sale vacío. Juntarlo metería los cambios de la rama integrada en el commit del hito;
- el rango ya está publicado: `git branch -r --contains <primer commit del rango>` no sale vacío (el primero lo da `git rev-list --reverse <base>..HEAD`). Reescribirlo obligaría a forzar el push.

El hito queda como está, y el walkthrough (o `patch.md`) dice cuál quedó sin juntar y por qué.

## El hash en los artefactos

Un commit no puede contener su propio hash. El de la task N se escribe en `tasks.md` en el commit del hito siguiente —la task N+1 o, para la última, el cierre—, y el del fix de un patch, en `patch.md` en el commit de cierre. Es siempre el hash del commit ya juntado; la línea del ledger de `subagent-driven-development` también usa `<base>..<hash juntado>`.

## Tests RED sin commitear

Los tests RED de la task los escribe el hilo antes del despacho y **no los commitea**: van en el commit de la task. Con un `pre-commit` que exige la suite en verde, un commit de tests en rojo no se puede hacer sin `--no-verify`, y con el juntado ya no aportaría nada a la historia. Antes de despachar, guarda una copia fuera del repo; al volver el implementador, compárala con el test commiteado (`git diff --no-index <copia> <ruta>`). Un cambio que no sea de formato va al revisor de la task.

La apertura se junta antes de escribir los RED de la primera task, y cada hito, antes de los de la task siguiente. Si con un RED en el árbol tienes que commitear otra cosa (un ruling, un fix del hilo, un merge de sincronización), apártalo antes —la copia ya está fuera del repo—, commitea y devuélvelo: un `pre-commit` que corre la suite también ve los ficheros sin seguimiento. En el RED, 1 de 2 sujetos escribió el RED con la apertura sin juntar (`tests/native-adapt-red.md`).
