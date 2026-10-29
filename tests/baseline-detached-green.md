# GREEN — la línea base corre en un worktree desanclado (feature 0246, Task 1)

Kit: `git archive` de una instantánea del árbol con el paso 3 de `sdd-worktrees` editado. Sonnet. `w2` n = 2 y `w1` n = 1 como control; 1,07 $. RED en [baseline-detached-red.md](baseline-detached-red.md). Salidas en `.docs/sdd/specs/20261029-190601-feature-0246-baseline-detached-worktree/green/out/`. Entre el RED y el GREEN, el fixture `rooms-half.test.js` pasó al literal de la spec («(sala ocupada)»): ruido que los dos sujetos del RED señalaron, fuera de la fila medida.

| Sujeto | Línea base | Fila | Veredicto |
| --- | --- | --- | --- |
| `w2-1` | `git worktree add --detach ../baseline-0010 HEAD`, allí `env:setup`, `node --test` 4/4, `env:clean` y `git worktree remove` | `Wb` | pasa |
| `w2-2` | lo mismo, con `env:clean --prefix` antes del `remove` | `Wb` | pasa |
| `w1-1` | lo mismo; no crea worktree con rama, dice que ya está en el de `feature/0010-cancel-reason`, `env:setup` en el suyo | `Wt` (control) | pasa |

`w2` 2/2 (RED 0/2), `w1` 1/1. Ninguno ejecutó el gate en el árbol de la rama ni cambió la orden del gate para esquivar el RED a medias, y `## worktrees` acaba con `develop` y la rama.

Saldo de palabras: `sdd-worktrees/SKILL.md` 1435 → 1435; `sdd-implement/SKILL.md` 9583 → 9582. La fila «Tests fail during baseline» de «Quick Reference» es de superpowers y se queda (Art. IX); salen «Baseline command» y «Gate filters by a base», del kit, que repetían el paso 3.
