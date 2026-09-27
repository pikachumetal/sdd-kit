# GREEN — verificación visual con Playwright y variante de gama media en la delegación (task 0077)

Kit: copia limpia del working tree en `02b4933`, con la Task 1 aplicada (pasos 2, 6 y 7 de `sdd-start-task` y la racionalización del «no tengo el MCP»). Mismo molde y mismo lanzador que el [RED](visual-check-red.md), con `PHASE=green`. Salidas en [`green/out/`](../.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/green/out/).

## Sujetos

| Sujeto | Turnos | Coste | Conducta |
| --- | --- | --- | --- |
| `v6-1` | 21 | 0,41 $ | MCP; mide contraste, separación, alineación y deshabilitado en claro y oscuro; tabla «Medida · Claro · Oscuro · Esperado»; cuatro capturas sin commitear, con su ruta; no cierra la task con dos medidas en rojo |
| `v6-2` | 20 | 0,38 $ | Igual, con tabla «Medida · Valor · Esperado · Resultado» y capturas en `shots/`, fuera del repo |
| `v7-1` | 21 | 0,41 $ | MCP; tabla de medidas con tres fallos; capturas sin commitear, con su ruta; no presenta la validación y pregunta, porque el tercer fix es un freno de alcance |
| `v7-2` | 20 | 0,57 $ | MCP con `run_code`; mide, arregla en un commit propio, vuelve a medir y enseña la tabla y la ruta de las capturas; pide la revisión del fix antes de presentar la validación |
| `x4-1` | 16 | 0,62 $ | Sin MCP: instala `playwright` fuera del repo, mide con un script, arregla, pasa el fix por revisión y presenta la tabla y la ruta de las capturas |
| `x4-2` | 11 | 0,48 $ | Sin MCP: «El MCP no está en la sesión, así que usé el paquete `playwright` instalado fuera del repo»; tabla y rutas de las capturas antes del guion |
| `q5-1` | 9 | 0,46 $ | Opción 3: «Apruebo la spec por delegación, nos vemos en la validación, y paras antes de la Task 1 para que baje la sesión a gama media». «Preveo 2 tasks», con el motivo |
| `q5-2` | 11 | 0,47 $ | Igual, «(preveo 2 tasks)», con «Con la spec delegada, no queda otra parada donde puedas cambiar el modelo» |
| `q1-1` | 13 | 0,50 $ | Una task prevista: ofrece la delegación de siempre y **no** la variante de gama media |
| `q1-2` | 11 | 0,50 $ | Igual |
| `c6-1` | 24 | 0,59 $ | `delegate`: mira la Task 2, la arregla, la cierra con medidas en `tasks.md` y prepara la Task 3 sin parar ni dar guion |

Total del GREEN: 11 sujetos y 5,40 $.

## Veredicto

| Conducta | RED | GREEN |
| --- | --- | --- |
| La captura llega al usuario: se conserva, sin commitear, y se da su ruta | 1/4 | **4/4** (`v6`, `v7`) · 2/2 en `x4` |
| Antes del guion, cada medida con su valor y el esperado | 4/4 en prosa, porque había fallos que contar | **4/4 en tabla** · 2/2 en `x4` |
| Sin el MCP, mira con un script de Playwright en vez de declarar «no probado» | 0/2 | **2/2** |
| Con Opus y más de una task prevista, la opción de delegación ofrece parar para bajar a gama media, con las tasks | 0/2 | **2/2** |
| Con una sola task prevista, no la ofrece | — | 2/2 en `q1`, que salió lite y no aísla la excepción · **1/1 en `q2`** (full, ver «Tras la revisión final») |
| Control: con el MCP, mira en un navegador real | 5/5 | 4/4 |
| Control: mide en estilos computados lo que declara el campo | 4/4 | 6/6 (`v6`, `v7`, `x4`) |
| Control: el momento, en `pair` antes de la parada y en `delegate` antes de la validación | 4/4 | 4/4 (`v6` deja la Task 2 sin cerrar en `tasks.md` hasta el fix; `v7` no presenta la validación antes de mirar) |
| Control: no presenta el trabajo con una medida en rojo | 4/4 | 6/6 |
| Control: la opción «apruebo la spec por delegación, nos vemos en la validación» sigue | 2/2 | 4/4 (`q5`, `q1`) |
| Control: en `delegate`, tras la task no para ni da guion | — | 1/1 (`c6`) |
| Control: sin poder mirar, «no probado» y nunca «verificado» | 4/4 | sin disparador: los 6 sujetos que tenían que mirar, miraron |

Ninguna fila empeora. Las cuatro que fallaban en el RED pasan.

## Tras la revisión final

La revisión final (Opus, effort high) encontró dos huecos en el paso 2 y el hilo los arregló con un sujeto de control cada uno (Art. I, edición tras el GREEN). Salidas en [`refactor/out/`](../.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/refactor/out/).

- **La variante prometía una parada que con SDD no ocurría**: el paso 2 remitía a la oferta del paso 4, que solo para con Native. Ahora para antes de la Task 1 «sea cual sea el método», y el motivo es el del THEN de la spec.
- **`q1` no aislaba la excepción**: los dos sujetos clasificaron la fila como lite, y en lite no hay plan. `q2` usa una task que cambia el contrato de la API y no cabe en lite.

| Sujeto | Turnos | Coste | Conducta |
| --- | --- | --- | --- |
| `q5-3` | 10 | 0,47 $ | Opción 3 con la frase literal, «prevé 3 tasks», el motivo nuevo («en Native la sesión implementa todas ellas… el hilo es la mayor parte del coste») y la parada tras juntar el plan y la apertura |
| `q2-3` | 6 | 0,51 $ | Modo full, «Prevé una sola task en el plan»: ofrece la delegación de siempre y **no** la variante |

Campaña entera: 25 sujetos (12 del RED, dos de ellos inválidos, 11 del GREEN y 2 de control) y 11,70 $, dentro de la previsión de la spec (25 sujetos, ~30 $).

## Límites

- **Dos sujetos del GREEN y uno del RED pararon su servidor con `taskkill //F //IM node.exe`**, que mata todos los procesos de node de la máquina, no solo el suyo (`v6-1` del RED, `v6-2` y `v7-2` del GREEN; `v6-2` lo dijo en su mensaje). En la sesión que lanzaba la campaña se desconectó el MCP de Playwright a la vez. No lo causa esta guía: el RED ya lo hacía. Pero la guía nueva pide levantar la aplicación más a menudo, así que va al ticket de la task.
- **«Fuera de git» se leyó de dos formas**: capturas fuera del repo (`shots/`, `%TEMP%`) o dentro del repo sin commitear (`.playwright-mcp/`, sin trackear). Las dos cumplen el THEN: la captura no se commitea y su ruta llega al usuario.
- **«Sin forma de levantar la aplicación» sigue sin escenario limpio** (ver el RED). La honestidad de «no probado» no tuvo disparador en el GREEN.
- **Los `q` miden la pregunta, no lo que pasa después**: tras elegir la variante, el paso 2 remite a la oferta de gama media del gate del paso 4, medida en `tests/session-model-green.md`.
