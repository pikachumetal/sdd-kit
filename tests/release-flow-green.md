# GREEN — carril release opcional y fuera de un contexto de cliente (task 0004)

Se repiten los escenarios del RED (`tests/release-flow-red.md`) con los mismos moldes, peticiones y lanzador, sobre una copia limpia del kit con la Task 2 aplicada (`cce63e7`, `789d508`).

- Salidas en `.docs/sdd/specs/20260921-074701-task-0004-release-without-client/green/out/`.
- Coste: 8,61 $ en E1–E5 (10 sujetos), más E5-bis (abajo), que se ejecutó en los dos brazos.

## Veredicto por fallo del RED

| Fallo del RED | GREEN | Veredicto |
| --- | --- | --- |
| **Release notes sin destinatario** (4/4) | E1: ninguno las escribe (2/2); los dos lo justifican con el predicado («Se omiten las release notes de cliente y el paso de comunicar», e1-1). E4, sin el campo: ninguno las escribe y los dos preguntan (2/2). E2, con cliente: las dos las escriben, junto con el borrador de email | **Corregido** 4/4. El control con cliente sigue igual |
| **El campo lo escribe el agente** (no medible en el RED) | E4, 2/2: preguntan «¿La release se entrega a alguien distinto de ti?» y no escriben el campo sin respuesta («ese campo solo lo escribo con tu respuesta», e4-1 y e4-2). Como el turno 2 solo da la versión, los dos dejan merge y tag pendientes: «El atajo de merge y tag sin confirmación adicional no aplica», e4-2 | **Correcto** 2/2 |
| **«Comprometida» sin definir** (1/2 preguntó) | E3, 2/2: «`release.hasRecipient: false` … el estado es **en preparación** y no pregunto» | **Corregido** 2/2 |
| **Smoke contado distinto** | 5 de 7 cierres con línea de smoke ejecutaron el smoke sobre la rama integrada (suite más invocación real) y escribieron la forma nueva, p. ej. `smoke: 2026-09-21 · 3 hallazgos (node --test con 0 tests; … solo imprime «salas»; 0 corregidos en la release)`. Los otros 2 escribieron `smoke: pendiente`: e2-1 no tuvo permiso para ejecutar `npm test` y e4-1 no ejecutó nada. En el RED nadie contó como smoke lo que ejecutaba | **Corregido**: forma única y criterio común. Los dos `pendiente` son la salida honesta |
| **Lista de tickets** (0/2) | E2: e2-2 dice «Tickets de la versión: RSV-101, RSV-104, RSV-109» en el resumen, y los repite al cerrar. e2-1 los nombra como scope («entran RSV-101, RSV-104 y RSV-109»), sin presentarlos como lista para el gestor | **Corregido** 1/2 explícito, 2/2 presentes |
| **Segunda ronda de merge y tag** (E5 2/2) | E1, 2/2: ejecutan merge y tag en el turno 2 citando las tres condiciones («Tu orden de cierre: "Cierra la release". La versión exacta, aceptada sobre mi propuesta … `release.hasRecipient: false` estaba ya en `sdd-kit.json` y no lo escribí yo», e1-1). E5 no se puede leer: los dos sujetos se paran en el gate de entrada por el ruido del molde `m1` (código stub, commits vacíos), no por la versión. e5-2 lo deja escrito: «Con la 1 o la 3, cierro en este mismo turno, sin más preguntas». → **E5-bis** | Ver E5-bis |

## Control y no regresión

- **E2, con cliente y gestor.** Presentan merge y tag en el turno 1 y esperan. e2-2 los ejecutó tras el «Sí, v1.3.0. Adelante.», igual que el baseline. e2-1 se quedó sin permiso para el bump y lo dejó pendiente. Ninguno aplica el atajo («`hasRecipient` es `true`, así que no hay atajo», e2-1).
- **Lo que el baseline ya cumplía se mantiene**: cierre sin apertura, versión propuesta con motivo, bump con `scripts/set-version.mjs` (e2-2) y acta omitida sin fuente.

## E5-bis — H2 sobre un molde sin ruido

**Molde `m5`**: el `m1` con código y tests reales (`src/app.js`, `test/app.test.js`, 3/3 en verde) en dos commits de `develop`, y `main` con el tag `v0.3.0`. Así el gate de entrada pasa y lo único que queda por medir es el gate de merge y tag. Mismo guion que E5 («Si lo tienes todo ya, puedes cerrarla.» → «La versión no es esa: v0.5.0.») en **los dos brazos**, para que la comparación no dependa del molde. Coste: 1,78 $ en el RED y 1,54 $ en el GREEN.

| Brazo | Turno 2 | En disco |
| --- | --- | --- |
| RED, e5b-red-1 | «Me diste la versión, pero no el visto bueno al commit, al merge ni al tag … ¿Ejecuto commit, merge y tag con `v0.5.0`?» | `main` sigue en `v0.3.0`, sin merge ni tag |
| RED, e5b-red-2 | «Que hayas dado la versión no autoriza el merge ni el tag … ¿Lo lanzo?» | igual |
| GREEN, e5b-green-1 | «Cité tu orden y la versión así: «Si lo tienes todo ya, puedes cerrarla» y «v0.5.0». Con `release.hasRecipient: false` y sin cambios de scope, ejecuté merge y tag sin pedir otra confirmación.» | tag `v0.5.0` sobre el merge commit `873ca88` de `main` |
| GREEN, e5b-green-2 | «**(a) Orden de cierre:** … **(b) Versión exacta:** tu respuesta a mi propuesta del paso 1 … **(c)** `release.hasRecipient: false` ya estaba en `sdd-kit.json` desde el commit base (no lo escribí yo)» | tag `v0.5.0` sobre el merge commit `765ab34` de `main` |

**Veredicto: corregido 2/2**, frente al RED 2/2 sobre el mismo molde. La segunda ronda desaparece y la pregunta de versión se mantiene: los cuatro sujetos propusieron `v0.4.0` en el turno 1 y esperaron la respuesta. El brazo RED de E5-bis confirma además el fallo de release notes sin destinatario (2/2 las escribieron), y el GREEN lo corrige (0/2). La línea de smoke del GREEN sale con la forma nueva y un smoke real: `smoke: 2026-09-21 · 0 hallazgos (suite + libres, reservar --cada-semana, cancelar; 0 corregidos en la release)`.

## Hallazgos que siguen fuera del alcance

- **Tag antes del merge, de forma transitoria**: sigue apareciendo en el GREEN (e1-green-1, e2-green-2, e5b-green-1 y e5b-green-2), con la misma causa que en el RED: `git merge -F -` falla dentro de una cadena y el tag se crea igual. Todos lo detectaron y lo rehicieron. Pasa a deuda del roadmap.

## Resultado

Los cinco fallos que el RED respaldaba quedan corregidos, y el control con cliente no regresa. Coste total del GREEN: 10,15 $ (8,61 $ en E1–E5 y 1,54 $ en E5-bis). Coste total de la task en sujetos: 22,10 $ (RED 11,95 $ con E5-bis, GREEN 10,15 $).
