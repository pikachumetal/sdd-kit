# RED y GREEN — el paquete de la revisión final en el workspace de la feature (feature 0322)

Receta del paquete de [`encargo-revision.md`](../skills/sdd-verify/references/encargo-revision.md), ejecutada a mano en esta rama, y el escenario `f1` de la [batería de `sdd-verify`](batteries/sdd-verify/battery.md) con `N=1`. Origen: el menor del [ticket de la feature 0300](../.docs/sdd/field-reports/20261103-184539-feature-0300-skill-source-build-dist.md) y el [de la 0313](../.docs/sdd/field-reports/20261109-085546-feature-0313-tasks-superpowers-7.md) §4, que trajo `sdd workspace -C`.

## RED y GREEN estructurales

El fallo está en la receta y no en la conducta, así que se prueba ejecutándola. Un script del scratchpad toma la línea `WORKSPACE=` del fichero tal cual, rellena `<plan>` y `<worktree de la feature>`, la ejecuta dentro de un worktree desanclado `review-0322chk-<sha>`, escribe allí el paquete, borra el worktree con `git worktree remove` y mira si el paquete sigue. `<worktrees>` es la carpeta de los worktrees de la máquina.

| Fase | Línea de la receta | Ruta del paquete | Tras `git worktree remove` |
| --- | --- | --- | --- |
| RED (`3825e778`) | `WORKSPACE="$(sdd workspace "<plan>")"` | `<worktrees>\review-0322chk-3825e778\.temp\sdd\plan/review-final-3825e778.diff` | el paquete ya no existe |
| GREEN (texto de la Task 3) | `WORKSPACE="$(sdd workspace -C "<worktree de la feature>" "<plan>")"` | `<worktrees>\feature-0322-deviations-and-amendments\.temp\sdd\plan-20261109-102437-feature-0322-deviations-and-amendments/review-final-8d9ca079.diff` | el paquete sigue |

Antes de la spec ya se había visto lo mismo con `sdd workspace` a secas (decisión 12): dentro del worktree de revisión da `…\review-0322red-9d8f5143\.temp\sdd\plan`.

Saldo de palabras de `encargo-revision.md`: 1.158 → 1.157. La línea suma 5 palabras, y las compensan «In lite mode, without a plan, `<plan>` is `spec.md`.» → «In lite mode, `<plan>` is `spec.md`.» y «is the name of the spec's folder» → «names the spec's folder».

## `f1` con el kit de la rama

| Sujeto | Kit | Cómo ejecutó la receta | Paquete | Xw (`-C` en la llamada) | Xw2 (destino) |
| --- | --- | --- | --- | --- | --- |
| f1-1 (`green/`) | rama | crea `review-0010-<sha>` pero ejecuta la receta desde el repo de la feature, sin `cd "$REVIEW_DIR"`, con `sdd workspace <plan>` sin `-C` | `<run>\repo\.temp\sdd\plan/review-final-535c533.diff`, en el workspace de la feature | falla | pasa |
| f1-1 (`control/`) | `develop` | lo mismo: receta desde el repo de la feature, `sdd workspace "$PLAN"` | `<run>\repo\.temp\sdd\plan/review-final-6ee2e1e.diff`, en el workspace de la feature | falla | pasa |

**Veredicto `f1`: Xw 0/1 con los dos kits; no es un rojo nuevo** (decisión 13 de la spec). Los dos sujetos dejan el paquete donde pide el THEN, pero porque no entran en el worktree de revisión, no por el `-C`. Este molde no reproduce el fallo de campo de la 0300, que salió de seguir la receta tal cual dentro de `$REVIEW_DIR`. La fila Xw queda como está (es la decisión 10 aprobada) y mide la forma de la llamada, no el destino. El THEN lo cubre la comprobación estructural de arriba. Coste: `f1` de la rama, 1,66 $; el control va en la tanda `control` (6 sujetos, 3,94 $, con `k1` y `a3`, [evidencia del tramo](sdd-implement-0322-tramo.md)).
