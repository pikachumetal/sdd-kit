# RED — el contraste de un rojo corre primero el fichero que falla (feature 0230)

Kit de `develop` en `b07b148b` (`git archive b07b148b skills .claude-plugin cli hooks`), sujetos headless Sonnet, superpowers 7.0.0. Salidas en `.docs/sdd/specs/20261028-131603-feature-0230-red-contrast-failing-file-first/red/out/`. Escenarios y rúbrica: `a3a` y `a8` en `tests/batteries/sdd-archive/battery.md`.

Ruido de la tanda: el `RUNS_DIR` iba en el scratchpad de la sesión, con una ruta de ~190 caracteres, y git dio `Filename too long` en los `git worktree add`, `git clone` y `sdd merge` de los sujetos. `a3a-2` no pudo fusionar por eso, y `a8-1` hizo la re-revisión sobre un `git archive`. Lo que se puntúa abajo lo decidió cada sujeto antes de chocar con la ruta. El GREEN corre en `.temp/r30` del worktree.

| Escenario | Fila | Resultado | Evidencia |
| --- | --- | --- | --- |
| a3a | C4 Fichero primero | ❌ 0/2 | `a3a-1.tools.txt:264-281` y `a3a-2.tools.txt:157`: los dos contrastan con `node --test test/app.test.js test/cancel.test.js test/store.test.js`, la tarea `bookings:test` entera, uno detrás de otro y nunca con el fichero solo |
| a3a | C5 Entorno de la base | ✅ 2/2 | `a3a-1` clona y corre `npm ci --offline`; `a3a-2` enlaza `node_modules` del molde. Ninguno toma por verde una pasada sin la dependencia |
| a3a | C6 Veredicto | 1/2 | `a3a-2` abre la fila de intermitentes con la línea `EBUSY` entera, pero no fusiona (la ruta larga); `a3a-1` acaba sin fila ni merge |
| a8 | S2 Sha de la validación | ❌ | `a8-1/walkthrough.md`: el 4.1 dice `sobre c2fc23a`, el borrador que el cierre junta; ninguno de los dos llega a `sdd merge` (paran en la re-revisión). Fuera del escenario, `a3a-2/walkthrough.md` dice `sobre 850c10a`, que tampoco es antecesor de su cierre `e5ed3c9` |

Lectura por regla:

- **El fichero rojo primero, en la rama y en la base a la vez** (`merge-recipe.md`, «A red suite»; `SKILL.md` paso 6): falla 0/2. Se escribe.
- **El entorno de la base preparado**: los dos lo prepararon sin la regla (2/2), pero clonar e instalar a mano fue lo que chocó con la ruta. Va en la misma frase, citando el Step 2 de `sdd-worktrees`, sin fallo propio.
- **El sha del commit de cierre cuando el cierre junta la validación** (`SKILL.md` paso 2, «Integrated base»): falla en los dos sujetos que escribieron el 4.1. Se escribe.

Coste: 4 sujetos, 2,80 $ (0,70 $ por sujeto, frente a los 0,30 $ de la previsión: enmienda de la spec del 2026-10-28).
