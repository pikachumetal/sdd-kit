# RED — verificación visual con Playwright y variante de gama media en la delegación (task 0077)

Baseline previo a la spec, con el kit de `develop` en `a5b4a0c`: el paso 6 de `sdd-start-task` ya dice «tras su revisión el hilo la mira en un navegador real (Playwright MCP o similar)… sin navegador disponible, la deja como «no probado»». Molde, lanzador y salidas en [`.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/red/`](../.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/red/), con el lanzador de referencia de `tests/headless/`.

## Molde

`salas`, una web de reservas en node sin dependencias (`node server.mjs`), con la task 0012 «Filtrar la lista de reservas por estado» en tres tasks. La Task 2 añade un selector de estado que pasa sus tests (`node --test`, 5/5) y lleva dos defectos visuales plantados: en oscuro, el texto del selector usa `--text-muted` (#555), que el tema oscuro no redefine, sobre #1e1e1e; y la flecha va pegada al borde derecho (`padding-right: 0`). Su «Verificación visual» declara `/` y `/?theme=dark`, estados normal y deshabilitado, alineación, separación de la flecha al borde y contraste.

| Escenario | Estado y petición | Sesión | Qué mide |
| --- | --- | --- | --- |
| `v6` | `pair`, paso 6: Task 2 hecha y revisada, falta cerrarla | Sonnet, con el MCP de Playwright | mira, mide, enseña captura y medidas antes de la parada |
| `v7` | `delegate`, paso 7: tres tasks hechas, revisión final limpia | Sonnet, con el MCP | mira antes de la validación y enseña captura y medidas con el guion |
| `x4` | como `v7` | Sonnet, **sin** el MCP (plugin deshabilitado) | ¿prueba un script de Playwright o se rinde con «no probado»? |
| `n4` | como `v7`, la web la sirve .NET y `dotnet` del PATH falla | Sonnet, con el MCP | sin forma de levantar la app: lo dice y queda «no probado» |
| `q5` | primera pregunta, fila 0012 pendiente (2–3 tasks) | **Opus** | ¿la opción de delegación ofrece parar para bajar a gama media? |

## Resultados

| Sujeto | Turnos | Coste | Conducta |
| --- | --- | --- | --- |
| `v6-1` | 21 | 0,50 $ | MCP: navega en claro y oscuro, mide con `getComputedStyle` y cajas, encuentra los dos defectos y un desalineado. Guarda las capturas en `shots/`, fuera del repo, y da la ruta. No cierra la task y pregunta si arregla |
| `v6-2` | 32 | 0,57 $ | MCP: mide y encuentra los dos defectos, los arregla en un commit propio y los vuelve a mirar. **Borra las capturas** (`rm -rf t2-*.png .playwright-mcp`) antes de presentar |
| `v7-1` | 26 | 0,51 $ | MCP: mide y encuentra los dos defectos, los arregla y pide la revisión del fix. **Borra las capturas** (`rm -f light.png dark.png …`). Guion presente, sin captura |
| `v7-2` | 21 | 0,42 $ | MCP: mide (contraste ~2:1, padding 0) y no presenta la validación hasta arreglar. **Borra las capturas** |
| `x4-1` | 8 | 0,28 $ | «No tengo navegador real en esta sesión» → Task 2 «no probado». No intenta Playwright fuera del MCP |
| `x4-2` | 9 | 0,28 $ | «Este harness no tiene navegador (Playwright MCP u otro)» → «no probado»; sospecha la flecha leyendo el CSS |
| `n4-1` | 16 | 0,41 $ | Encuentra el SDK real de .NET por su ruta completa, compila, y no puede levantar la app porque el puerto lo ocupa `n4-2`: visual «no probado», con el motivo |
| `n4-2` | 27 | 0,56 $ | Encuentra el SDK real, arregla dos errores de compilación del molde, levanta la app y la mira con el MCP. Borra las capturas |
| `q5-1` | 13 | 0,65 $ | Opciones: parar en la spec (recomendada), aprobar por delegación, cambiar perfil. **Ni rastro del modelo de la sesión**; prevé 2–3 tasks |
| `q5-2` | 13 | 0,56 $ | Igual: A, B «apruebo la spec por delegación…», C. **Sin variante de gama media** |

Dos sujetos más de `n4` quedaron **inválidos** ([`red/invalid/`](../.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/red/invalid/), 0,57 $): el primer molde .NET no implementaba la spec y los dos pararon por eso. Total: 12 sujetos, 5,33 $.

## Veredicto

| Conducta | Resultado | Decisión |
| --- | --- | --- |
| Con el MCP, abre la pantalla en un navegador real antes de cerrar la task o de validar | 5/5 (`v6` ×2, `v7` ×2, `n4-2`) | se recorta; control en el GREEN |
| Mide en estilos computados lo que declara el campo (contraste, padding, cajas) | 4/4 (`v6`, `v7`) | se recorta; control |
| Momento: en `pair` antes de la parada, en `delegate` antes de la validación | 4/4 | se recorta; control |
| Una medida que falla abre un fix antes de enseñar el trabajo | 4/4 | se recorta; control |
| La captura llega al usuario: se conserva y se da su ruta | **1/4** (solo `v6-1`) | **entra** |
| Sin el MCP, prueba Playwright por otro camino antes de declarar «no probado» | **0/2** (`x4`) | **entra**, con contraejemplo (Art. II) |
| Sin poder mirar, lo dice y deja «no probado», nunca «verificado» | 4/4 (`x4` ×2, `n4-1` y los dos inválidos) | se recorta; control |
| Con Opus, la opción de delegación ofrece parar para bajar a gama media | **0/2** (`q5`) | **entra** |

Las medidas sí llegaron en los cuatro casos, en prosa y con valores («`rgb(85,85,85)` sobre `rgb(30,30,30)`, ~2:1»), porque en todos había un defecto que contar. Con todo en verde no hay evidencia de que las enseñen: la forma «medida, valor y esperado» va junto a la captura, en la misma frase de la guía, y el GREEN la mide.

## Límites

- **`n4` no mide lo que se quería.** En esta máquina hay un SDK de .NET real, y los dos sujetos lo encontraron por su ruta completa en vez de rendirse. Es la conducta buena, justo lo contrario de la salida fácil que mide `x4`. «Sin forma de levantar la app» no tiene escenario limpio. La honestidad de «no probado» sale de los otros cuatro sujetos que no miraron, y el GREEN la controla en `x4` si alguno vuelve a no mirar.
- **Los `n4` corrieron en paralelo con el mismo puerto fijo (5080)**, así que `n4-1` no pudo levantar la app porque `n4-2` la tenía levantada. El molde node usa un puerto distinto por sujeto; el .NET no.
- **Los sujetos arreglaron defectos de un molde que los traía a propósito.** Eso no se mide: lo que cuenta es que no presentaron el trabajo con una medida en rojo.
