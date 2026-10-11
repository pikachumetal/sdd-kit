# RED — `sdd-tdd` (feature 0165)

Baseline de las piezas condicionadas de la feature 0165, con el kit del commit `6b651ea0` (la rama tras fusionar `develop`: `sdd-implement` carga `superpowers:test-driven-development`) y superpowers 7.0.0 por `SUPERPOWERS_DIR`. Batería: [`tests/batteries/sdd-implement/`](batteries/sdd-implement/battery.md), pasos `tdd-red` y `red-writer`. Sujetos Sonnet, headless; salidas en [`red/out/`](../.docs/sdd/specs/20261011-143353-feature-0165-tdd-and-debugging/red/out/). Coste: 1,85 $ en 8 sujetos.

## Por pieza

| Pieza | Escenario | Resultado | ¿Se escribe? |
| --- | --- | --- | --- |
| Antipatrón tautológico | `t2` | 0/2. Los dos escriben `assert.equal(run('horas', ['Norte']), 'Norte: 2 h')` y `'Sur: 0 h'`: los literales del THEN. Ninguno usa `slotHours`, que el plan nombra en «Interfaces», ni `run('duracion', …)` | No: a deuda |
| Costura y antipatrón acoplado | `t3` | 0/2. Los dos prueban por `run('reactivar', …)` y `run('libres', …)`; ninguno lee ni exporta `bookings`. `t3-1` añade una precondición (`libres` da `Norte, Sur` antes de reactivar), que sale del GIVEN | No: a deuda |
| El hilo ve fallar su RED | `t2`, `t3` | 0/4. Los cuatro ejecutan el RED antes del primer cambio en `src/app.js` y leen el motivo (`actual: 'salas'`, `expected: 'Norte: 2 h'`); tres guardan la copia del RED fuera del repo antes de ejecutarlo | No: la pieza de la 0007 sigue en deuda, ahora con un 3.er caso limpio |
| Aserciones fuera de la spec | `t2`, `t3`, `t5a`, `t5b` | 0/8. Cada test es un THEN o un AND | — |
| Escritor de RED en Native | `t5a`, `t5b` | Limpio, 4/4: los mismos literales y la misma costura que el hilo, en 5-6 turnos y 0,10-0,17 $ por sujeto. `t5b-2` usa `assert.doesNotMatch(…, /Norte/)` en vez del literal `'Sur'`: más laxo, no peor. No mejora nada que el hilo haga mal | No: no gana (spec, decisión 6); la Task 3 se salta |

## De dónde sale la conducta limpia

Los cuatro hilos cargan `superpowers:test-driven-development` (paso 5 de la preparación de `sdd-implement`), cuyo `writing-good-tests.md` ya pide derivar el esperado sin el código bajo prueba y no afirmar sobre mocks. El fork lo conserva entero en `sdd-tdd/references/writing-good-tests.md`: la fuente de la conducta no es incidental y no se pierde. Lo que no entra es lo que añadía Matt (los nombres y los indicios) y la regla de la costura, que no tienen fallo detrás.

## `d1` — un patch de un fallo determinista (Task 4)

Petición de `a3` de la batería de `sdd-propose` («patch: si cancelo Norte el martes… me quita la del lunes»), seguida hasta el arreglo, con el segundo turno «Sí, como patch.» si pregunta el carril. Kit `6b651ea0` con superpowers 7.0.0. Salidas en `red/out/d1-*` y, la tanda que se paró a preguntar sin segundo turno, en `red-question/out/`.

| Conducta | Resultado |
| --- | --- |
| Invoca la skill de depuración | **0/2**: ninguno invoca `superpowers:systematic-debugging`; leen el código, reproducen y arreglan (la fila de deuda del patch 0101: «Un patch reproduce la causa con un test RED sin invocar `systematic-debugging`») |
| §2 de `patch.md` (la causa) antes del arreglo | **1/2**: `d1-2` edita `src/app.js` y escribe `patch.md` después |
