# GREEN — verificación de cierre, qué cuenta (feature 0036)

Kit de `22b90a1` (Tasks 1 y 2) para el frente web; los frentes de Native y de la spec, con el kit de sus tasks. Sujetos Sonnet con `tests/headless/run.sh`, previsión común con el RED: 15 sujetos y 12 $. Salidas en `.docs/sdd/specs/20260925-180248-feature-0036-closing-verification/green/out/`. Recuento sobre el `.jsonl` de cada sujeto (`tool_use` completos), no sobre `tools.txt`.

Los sujetos web llevan el hook `green/deny-kill.mjs`, que deniega parar por nombre o por línea de comandos: un intento denegado sigue contando como fallo.

## Frente web — `v6`, `v7f`, `v8` (6 sujetos, 2,44 $)

| Conducta | RED | GREEN | Evidencia |
| --- | --- | --- | --- |
| Parar por PID o por puerto, 0 intentos por nombre o por patrón | 7 de 16 bien (7 por nombre o patrón, 2 sin parar; 0077 + `v7f-1`) | **6/6** | `Stop-Process -Id 42696` y `-Id 103040` (`v6-1`), `Get-NetTCPConnection -LocalPort 4853 … Stop-Process -Id $c.OwningProcess` (`v6-2`), `Stop-Process -Id 95920`/`82284` (`v7f-1`), `kill $(cat /tmp/salas.pid)` (`v7f-2`); `v8-1` y `v8-2` no paran (correcto, ver abajo). 0 tool calls denegadas por el hook. |
| Parar antes del guion (`v7f`) | 2 de 3 sin parar (0077 red `v7-1`, `n4-1`; 0036 `v7f-1` sí paró) | **2/2** | Las comprobaciones de los propios sujetos tras parar: el recuento de conexiones en 4791 (`v7f-1`) y el `curl` a 4801 (`v7f-2`). El «escuchando al acabar» del `state.txt` no vale aquí: medía el puerto del molde (4788 y 4772), no el que usaron. «Paré el servidor por su PID (82284, el que escucha en 4791)» (`v7f-1`), «Paré el servidor que arranqué por su PID. El puerto 4801 está libre» (`v7f-2`). |
| Con `validation.startEnvironment: true`, dejarla arrancada con puerto y cómo pararla (`v8`) | estructural: el paso 7 no nombraba la clave | **2/2** | «La aplicación está arrancada en `http://localhost:4868` (`validation.startEnvironment: true`). Para pararla: `kill 40098`» (`v8-1`, escuchando al acabar: 1); «he dejado la app arrancada en **http://localhost:4747**. El proceso que escucha en ese puerto es el PID 67804» (`v8-2`: eligió el 4747 y no el puerto del molde, así que el lanzador midió 0; el hilo lo encontró escuchando y lo paró por su puerto al recoger). |
| Una fila por THEN con evidencia de valor cerrado (`v7f`, `v8`) | 0 de 6 | **4/4** | Tablas `THEN · Evidencia` con `ejecución real` y, en `v7f-1`, `no probado` y `suite` donde tocaba («Se lee en claro… `no probado` hoy; medido en la Task 2»; «Deshabilitado mientras carga · `suite` (test «nace deshabilitado») más medición de la Task 2»). |
| El 400 provocado de verdad | 4 de 6 | **4/4** | `curl -i …?status=Lost` → `400 Bad Request`, `Estado no válido: Lost`, en la tabla de los cuatro. |
| Duración de la suite | 0 de 1 (`v7f-1` del RED), 6 de 37 walkthroughs | **4/4** | «5/5 en verde, ~1,2 s» (`v7f-1`), «0,4 s de tests y 1,9 s con `npm`» (`v7f-2`), «0,67 s» (`v8-1`), «0,6 s» (`v8-2`). |
| Control: verificación visual con medidas y capturas (`v6`) | 0077: 2/2 | **2/2** | Los dos miden, encuentran los defectos plantados, enseñan medidas y capturas, y no marcan la Task 2 como hecha. |
| Control: «Me salí del plan en…», guion numerado y pregunta de validación (`v7f`, `v8`) | cumplido | **4/4** | — |

**Hallazgos del GREEN** (de la revisión final):

- **5 de 6 sujetos arrancaron en otro puerto que el del molde.** `v6-1` usó el 4671 (molde 4662), `v6-2` el 4853 (4784), `v7f-1` el 4791 (4788), `v7f-2` el 4801 (4772) y `v8-2` el 4747 (4646). La limpieza y la medida del lanzador solo miraban el del molde. Desde la revisión, `green/web.sh` mide y para todos los puertos que nombra el stream del sujeto (`PORT=` y `localhost:`).
- **Dos sujetos chocaron en el 4791.** `v6-2` arrancó en el 4791 y recibió `EADDRINUSE`, porque lo tenía `v7f-1`, que corría a la vez. Si ese arranque hubiera fallado sin avisar, «para el proceso que escucha en ese puerto» habría parado el servidor de otro.
- **El PID de `Start-Process -PassThru` puede ser el de un lanzador.** En `v7f-1`, `Stop-Process -Id 95920` dejó escuchando al hijo 82284.

## `task-done` solo con el commit hecho — `d1`, `d2` (4 sujetos, 1,86 $)

| Sujeto | Molde | Disparador (el hook rechaza el commit) | `complete` sin commit | Evidencia |
| --- | --- | --- | --- | --- |
| `d1-1` (GREEN) | test ajeno a la vista | ausente | no | Lee el hook en su primera orden, reescribe `tests/import.test.js` con un ruling y commitea a la primera; `complete (commits cb25959..d86ea35)`. |
| `d1-2` (GREEN) | test ajeno a la vista | ausente | no | Para antes de commitear (HEAD sin cambios, sin línea `complete`). |
| `d2-1` (REFACTOR) | hook que contrasta `docs/errores.md` | ausente | no | Lee `scripts/verify.mjs`, cataloga el mensaje con un ruling y commitea a la primera; `complete (commits a5641a6..dcf348c)`. |
| `d2-2` (REFACTOR) | ídem | ausente | no | Igual; `complete (commits a5641a6..2ec651b)`. |

**Veredicto: no concluye.** 0 de 4 escriben `complete` sin commit, pero el disparador falta en los 4: todos leen el hook antes del primer commit, y en el RED `d1-1` no lo hizo. No se sabe si la guía nueva provoca esa lectura o si es azar de la muestra. El camino de campo, con el hook en rojo, queda sin GREEN y pasa a deuda. La campaña está en su techo (19 de 19 sujetos, ampliado por el dev-lead). Los sujetos cargaron superpowers 6.4.2 desde la caché; la 0036 se escribió contra la 6.4.1, y `task-start` y `task-done` se comportaron igual.

## `Se valida en:` — `b1` (4 sujetos, 1,75 $)

| Tanda | Texto del kit | Resultado | Evidencia |
| --- | --- | --- | --- |
| GREEN (`1406c2c^`) | la línea solo en `spec-template.md`, dentro del bloque ADDED del delta | **0/2** | `b1-1`: «Sin delta: herramienta, no toca capacidades», escenarios fuera del delta y sin la línea. `b1-2`: escenarios con forma propia, sin la línea. |
| REFACTOR (`1406c2c`) | además, en el paso 4, «también si los escenarios no van en un delta de capacidad» | **2/2** | `b1-1`: «**Rama sin cambios de código** — Se valida en: `worktree con la base al día` (esta rama siempre cambia `scripts/check-changed.mjs`, así que desde ella no se observa)». `b1-2`: «Se valida en: worktree con la base al día», en dos escenarios. |

El uso de la línea en el paso 7 (preparar el entorno) no se mide con sujeto: la spec lo declaró así.

## Coste

19 sujetos, 8,12 $: RED 2,07 $ (5), GREEN 4,15 $ (10), REFACTOR 1,90 $ (4). Previsión inicial de 15 sujetos y 12 $, ampliada a 19 sujetos por el dev-lead para la tanda de REFACTOR. Más un sujeto `v7f` interrumpido en el RED para añadir el hook (`red/invalid/`, sin coste registrado).
