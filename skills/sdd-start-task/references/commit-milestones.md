# Un commit por hito

La rama de una task cuenta sus hitos: **apertura**, **un commit por task del plan** y **cierre** — 2 + N commits desde el `merge-base`, 3 en lite. La de un patch, dos: **fix** y **cierre**. Mientras un hito está abierto se commitea lo que haga falta: la revisión de `subagent-driven-development` trabaja por rangos `BASE..HEAD`. Cuando la revisión del hito queda limpia, su rango se junta en un commit.

## Qué lleva cada hito

| Hito | Lleva | Se junta | Base |
| --- | --- | --- | --- |
| Apertura | spec, hallazgos de la review de spec, `plan.md`, `tasks.md` (lite: solo la spec) | justo antes del primer despacho (lite: antes de implementar) | `git merge-base HEAD <integración>` |
| Task N | sus tests RED, su implementación, los arreglos de su revisión, su evidencia | con su revisión (y re-revisión) limpia, antes de despachar la siguiente o la revisión final | el `BASE` que apuntaste antes de despacharla |
| Cierre | documentación de `sdd-end-task`, arreglos de la revisión final de rama y de la validación | tras la documentación de cierre, antes del merge | el commit de la última task |
| Fix (patch) | código, tests y `patch.md` | con el fix verificado | `git merge-base HEAD <integración>` |
| Cierre (patch) | `patch.md` con hash y tiempo, changelog, roadmap, estimation-log | antes del merge | el commit del fix |
| Merge de sincronización | la rama destino integrada en la feature, con los registros resueltos | no se junta | — |

El merge de sincronización solo lo pide la [receta del merge](../../sdd-end-task/references/merge-recipe.md#conflicto-solo-en-los-registros); va después del commit de cierre y es el último commit de la rama, así que la historia queda en 2 + N (2 en un patch) más ese merge, y el cierre no se vuelve a juntar.

## Receta

Primero las dos guardas (siguiente sección). Si ninguna salta:

```bash
git reset --soft <base>
git commit        # convención de commits del proyecto
```

Con un solo commit en `<base>..HEAD` no hay nada que juntar. Nunca `rebase -i`, `push --force` ni `--no-verify`.

## Guardas

No se junta, y no se hace push forzado, si:

- el rango contiene un merge: `git rev-list --merges <base>..HEAD` no sale vacío. Juntarlo metería los cambios de la rama integrada en el commit del hito;
- el rango ya está publicado: `git branch -r --contains <primer commit del rango>` no sale vacío (el primero lo da `git rev-list --reverse <base>..HEAD`). Reescribirlo obligaría a forzar el push.

El hito queda como está, y el walkthrough (o `patch.md`) dice cuál quedó sin juntar y por qué.

## El hash en los artefactos

Un commit no puede contener su propio hash. El de la task N se escribe en `tasks.md` en el commit del hito siguiente —la task N+1 o, para la última, el cierre—, y el del fix de un patch, en `patch.md` en el commit de cierre. Es siempre el hash del commit ya juntado; la línea del ledger de `subagent-driven-development` también usa `<base>..<hash juntado>`.

## Tests RED sin commitear

Los tests RED de la task los escribe el hilo antes del despacho y **no los commitea**: van en el commit de la task. Con un `pre-commit` que exige la suite en verde, un commit de tests en rojo no se puede hacer sin `--no-verify`, y con el juntado ya no aportaría nada a la historia. Antes de despachar, guarda una copia fuera del repo; al volver el implementador, compárala con el test commiteado (`git diff --no-index <copia> <ruta>`). Un cambio que no sea de formato va al revisor de la task.
