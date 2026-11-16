# RED — la pasada de fix: el efecto, el valor de la spec y el Important que mete (feature 0246, Tasks 2 y 3)

Kit: `git archive` del commit de apertura `40c72058`, sin las reglas nuevas. Sonnet. Salidas en `.docs/sdd/specs/20261029-190601-feature-0246-baseline-detached-worktree/red/`. Rúbricas en `tests/batteries/sdd-verify/battery.md` (`C7`, `C8`, `C9`) y `tests/batteries/sdd-implement/battery.md` (`T6`).

## `c8` — un Important que mete la pasada de fix (reproduce)

| Sujeto | El `TypeError` que metió la pasada | `canceladas` vacío, de la revisión final | `C8` |
| --- | --- | --- | --- |
| `c8-1` | lo arregla en el hilo con test RED→GREEN y lo deja `sin revisar` | para como desvío («texto nuevo = THEN nuevo») | pasa (recalificado: parar como desvío vale, porque darle un texto añade un THEN) |
| `c8-2` | lo adjudica con ruling: «Queda abierto… Coste si me equivoco: quien lo teclee ve un stack trace» | lo adjudica | falla |

1/2 (el primer veredicto, 0/2, puntuaba distinto la segunda parte en el RED y en el GREEN; lo cazó el eje Spec de la revisión final). `c8-2` es el caso de campo de la 0236 §4: la regla vigente («An Important or a Minor: adjudicate it») deja en pie, con un ruling, el Important que metió la propia pasada.

## `c9` — el valor del arreglo sale de la spec (limpio)

Los dos sujetos topan `canceladas` en 20 (`MAX_CANCELLED = 20`, `CANCELLED_LIMIT = 20`), el de la decisión 4 de la spec, con la línea «… y N más», y no en el 10 que proponía el revisor. 2/2 sin la regla: la regla no se escribe (enmienda del 2026-10-29 de la spec; Art. I). El escenario se queda en la batería como control.

## `t6` — «sin bash» por el efecto (limpio)

`t6-1` escribe `usaBash(ruta)` con `ruta.endsWith('.sh') || /^#!.*\b(ba)?sh\b/.test(primera)`, que encuentra `scripts/hooks/pre-push` sin extensión, y lo pasa a Node. 1/1 sin la regla.

## `c7`, primer molde — el test de la pasada afirma el efecto (limpio en lo válido)

Guardado en `red/c7-first/`. `c7-1` escribe `assert.equal(run('canceladas', ['--desde']), 'indica un día: lun, mar, mié, jue, vie')`: el efecto. `c7-2` no llega al test: para por freno de alcance porque `--desde` no estaba en la spec del molde (ruido). 1/1 válido. El molde ponía fácil el efecto (`run()` devuelve la salida) y el hallazgo no nombraba la variable interna, como sí la nombraba el de la 0235 (`blocker`). El dev-lead eligió endurecerlo y medir otra vez: `--desde` en el Scope de la spec del molde y el hallazgo que nombra `missing`, la bandera que `parseSince` nunca pone a `true`.

## `c7`, molde endurecido — limpio

Salidas en `red/out/c7-*`. Con `--desde` en la spec del molde y el hallazgo que nombra `missing`, los dos sujetos escriben `assert.equal(run('canceladas', ['--desde']), 'indica un día: lun, mar, mié, jue, vie')`, y `c7-2` lo apunta como `Final: fixed parseSince nunca marca missing … RED→GREEN, suite 6/6`: arreglan la bandera y prueban el efecto. 2/2 sin la regla (0,58 $). La regla del efecto no se escribe (enmienda del 2026-10-29 de la spec); `c7` y `t6` quedan como controles. Un molde donde la salida no sale de `run()` (un proceso, un fichero) queda sin medir: si el campo trae un tercer caso, ese es el molde.
