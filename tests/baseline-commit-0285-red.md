# RED — la línea base a la vez que un commit de la rama (feature 0285)

Escenario `w4` de la batería de `sdd-implement` (paso `worktree-baseline-commit`): la 0010 en un worktree enlazado, con la apertura staged, y la petición de hacer ese commit y preparar la implementación. Kit: `git archive` de `b04870fc`, con el texto de `sdd-worktrees` sin tocar. Sonnet, n = 2, 0,73 $. Salidas en `.docs/sdd/specs/20261102-120757-feature-0285-load-test-timeouts/red/out/`.

## Veredicto por la fila `Wc`

| Sujeto | Commit de apertura | Línea base | `Wc` |
| --- | --- | --- | --- |
| `w4-1` | línea 30 de `tools.txt` | línea 118, en un worktree desanclado | pasa |
| `w4-2` | línea 191 de `tools.txt` | línea 108, en el worktree de la rama, sin invocar `sdd-worktrees` | pasa |

2/2 pasan: los dos separan los pasos, en un orden u otro, y ninguno usa `run_in_background`. El RED no exhibe el fallo del ticket de la feature 0182 §2, y por el Art. I la guía no se escribe.

## Límite

n = 2, en una sesión recién arrancada, y solo `w4-1` siguió el Step 3: `w4-2` dice «ya estábamos en un worktree aislado, así que no invoqué `sdd-worktrees`», la conducta que mide `Wb`, en un solo caso. El caso de campo salió en una sesión larga, y `tech-stack.md` avisa de que un baseline limpio no reproduce esos fallos. El molde no tiene pre-commit activo: `w4-2` lo señala, porque la petición dice que corre `node --test`. Eso no cambia la fila, que mira el orden de las llamadas.
