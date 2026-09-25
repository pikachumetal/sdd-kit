# GREEN — verificación de cierre, qué cuenta (feature 0036)

Kit de `22b90a1` (Tasks 1 y 2) para el frente web; los frentes de Native y de la spec, con el kit de sus tasks. Sujetos Sonnet con `tests/headless/run.sh`, previsión común con el RED: 15 sujetos y 12 $. Salidas en `.docs/sdd/specs/20260925-180248-feature-0036-closing-verification/green/out/`. Recuento sobre el `.jsonl` de cada sujeto (`tool_use` completos), no sobre `tools.txt`.

Los sujetos web llevan el hook `green/deny-kill.mjs`, que deniega parar por nombre o por línea de comandos: un intento denegado sigue contando como fallo.

## Frente web — `v6`, `v7f`, `v8` (6 sujetos, 2,44 $)

| Conducta | RED | GREEN | Evidencia |
| --- | --- | --- | --- |
| Parar por PID o por puerto, 0 intentos por nombre o por patrón | 8 de 16 bien (7 por nombre o patrón, 2 sin parar; 0077 + `v7f-1`) | **6/6** | `Stop-Process -Id 42696` y `-Id 103040` (`v6-1`), `Get-NetTCPConnection -LocalPort 4853 … Stop-Process -Id $c.OwningProcess` (`v6-2`), `Stop-Process -Id 95920`/`82284` (`v7f-1`), `kill $(cat /tmp/salas.pid)` (`v7f-2`); `v8-1` y `v8-2` no paran (correcto, ver abajo). 0 tool calls denegadas por el hook. |
| Parar antes del guion (`v7f`) | 1 de 3 sin parar (0077 red `v7-1`, `n4-1`; 0036 `v7f-1` sí paró) | **2/2** | «escuchando al acabar: 0» en los dos `state.txt`; «Paré el servidor por su PID (82284, el que escucha en 4791)» (`v7f-1`), «Paré el servidor que arranqué por su PID. El puerto 4801 está libre» (`v7f-2`). |
| Con `validation.startEnvironment: true`, dejarla arrancada con puerto y cómo pararla (`v8`) | estructural: el paso 7 no nombraba la clave | **2/2** | «La aplicación está arrancada en `http://localhost:4868` (`validation.startEnvironment: true`). Para pararla: `kill 40098`» (`v8-1`, escuchando al acabar: 1); «he dejado la app arrancada en **http://localhost:4747**. El proceso que escucha en ese puerto es el PID 67804» (`v8-2`: eligió el 4747 y no el puerto del molde, así que el lanzador midió 0; el hilo lo encontró escuchando y lo paró por su puerto al recoger). |
| Una fila por THEN con evidencia de valor cerrado (`v7f`, `v8`) | 0 de 6 | **4/4** | Tablas `THEN · Evidencia` con `ejecución real` y, en `v7f-1`, `no probado` y `suite` donde tocaba («Se lee en claro… `no probado` hoy; medido en la Task 2»; «Deshabilitado mientras carga · `suite` (test «nace deshabilitado») más medición de la Task 2»). |
| El 400 provocado de verdad | 4 de 6 | **4/4** | `curl -i …?status=Lost` → `400 Bad Request`, `Estado no válido: Lost`, en la tabla de los cuatro. |
| Duración de la suite | 0 de 1 (`v7f-1` del RED), 6 de 37 walkthroughs | **4/4** | «5/5 en verde, ~1,2 s» (`v7f-1`), «0,4 s de tests y 1,9 s con `npm`» (`v7f-2`), «0,67 s» (`v8-1`), «0,6 s» (`v8-2`). |
| Control: verificación visual con medidas y capturas (`v6`) | 0077: 2/2 | **2/2** | Los dos miden, encuentran los defectos plantados, enseñan medidas y capturas, y no marcan la Task 2 como hecha. |
| Control: «Me salí del plan en…», guion numerado y pregunta de validación (`v7f`, `v8`) | cumplido | **4/4** | — |

**Hallazgo del GREEN**: con `startEnvironment: true`, un sujeto puede dejar la aplicación en un puerto distinto del que declara el proyecto (`v8-2`, 4747 frente al 4646 del README). El guion lo dice, que es lo que la regla pide. Para las campañas, el lanzador de un escenario así tiene que parar también el puerto que el sujeto declara, no solo el del molde.
