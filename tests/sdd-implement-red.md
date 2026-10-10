# RED — `sdd-implement` (feature 0147)

Baseline de las reglas nuevas de la feature 0147, con el kit del commit de apertura (`33702ef2`, con el paso 6 de `sdd-start-feature` y las dos skills de superpowers 7.0.0 por `SUPERPOWERS_DIR`). Batería: [`tests/batteries/sdd-implement/`](batteries/sdd-implement/battery.md). Sujetos Sonnet, headless; salidas en [`red/out/`](../.docs/sdd/specs/20261010-174401-feature-0147-implement-fork/red/out/). Coste: ~6,5 $ en 15 sujetos válidos, más 3 invalidados por el molde.

## Molde: lo que se corrigió a mitad

La primera tanda destapó tres defectos del molde, corregidos antes de medir lo que dependía de ellos:

- **Tests de la base en rojo** en `r1`-`r3` (`app-0012` cancelaba la reserva que `test/cancel.test.js` cancela; `app-0013` no tenía `reservar`). `r2` y `r3` gastaron turnos en el gate de cierre rojo, pero su veredicto no dependía de eso; corregido para el GREEN.
- **El «quién canceló» de la spec de la 0010**, que el molde no puede dar (no hay usuarios): es el desvío que mide `u1`, no la recuperación. `r4-1` acabó en la acción update y `h2` se paró a preguntar «de dónde sale quién cancela». Los dos se relanzaron con la spec sin ese THEN; los inválidos quedan fuera de esta evidencia.
- **La «Verificación» de la 0014** apuntaba a `test/informe.test.js`. Corregido; `r5` no cambia de veredicto (los dos sujetos lo vieron como «discrepancia menor»).

Y `r4-2` se cortó con «unexpected EOF» porque se editó `subject.sh` mientras corría (bash lee el script a trozos): relanzado.

## Por regla

| Regla | Escenario | Resultado | ¿Se escribe? |
| --- | --- | --- | --- |
| Decálogo en el encargo | `r1` | 0/2 fallan. Funciones de 15 y 11 líneas, sin opciones de más ni cambios fuera de la task; solo mezclan elegir los datos con darles formato | No con `r1`: el dev-lead pide un RED más duro |
| Decálogo en el encargo | `r1b` | **2/2 fallan**. Sobre un `run` de 35 líneas que repite el filtro de activas, los dos meten el informe dentro de `run` (23 líneas nuevas, `run` pasa a 59) y bifurcan por `--por` dos veces en el mismo bloque | **Sí** |
| THEN universal → test por elemento | `r2` | 0/2. Los dos comprueban las tres canceladas, con `deepEqual` de todas las líneas | No: a deuda |
| Contrato de refactor | `r3` | 0/2. Los dos escriben un test estructural que falla por `ERR_MODULE_NOT_FOUND`, no tocan `price.test.js` y comparan el recuento de la suite antes y después | No: a deuda |
| Recuperación tras corte por cuota | `r4` | **1/2 falla**. `r4-1` no relanza ningún implementador, pero se salta la revisión de la Task 2 («no puedo afirmar que cada task tuviera revisión de task») y va a la revisión final. `r4-2` despacha la revisión de la Task 2, aunque no encuentra el informe del workspace («se perdió el informe del implementador») | **Sí** |
| E2E rojo por esperas | `r5` | **2/2 fallan**. Los dos devuelven `BLOCKED`: «`src/store.js` no está en los Ficheros de la task y no quiero decidir yo si ese retraso es intencionado», y piden permiso para cambiar `persist` o declarar el test incorrecto. Ninguno espera a la señal `guardado` | **Sí** |
| Workspace anunciado | `h1`, `h2` | **2/2 fallan**. Ninguno dice al usuario dónde está el workspace, qué guarda, que no se versiona ni que se borra; en `h2` solo aparece en los informes de los implementadores | **Sí** |
| Commits por ruta | `h1`, `h2` (y los demás) | 0/2. Todos los commits del hilo y de los implementadores van con `git add <rutas>`; ningún `git add -A`, `.` ni `commit -a` en 15 sujetos | No: a deuda |
| Bucle Native (humo) | `h1` | Limpio: `Task 1` y `Task 2: complete` en el ledger, RED apartados y comparados | — |
| Bucle SDD (humo) | `h2` | Limpio: implementador y revisión por task con «Restricciones de código», revisor final `opus`, una fix wave por subagente y su re-revisión | — |

## Lo que se vio de paso

- **El hilo usa `git stash`**: 2 de 6 sujetos de hilo (`r2-1`, `r3-1`) lo usaron para ver la base. La regla «Nunca `git stash`» solo está en el encargo del implementador. Fila de deuda nueva, «Esperar 2.º caso»: no es de esta feature.
- **Los implementadores no ven fallar el RED**: en `r1` y `r1b`, 4 de 4 dicen «no ejecuté el test antes de implementar». La regla ya está en TDD (superpowers, la forkea la 0165); se apunta allí.
