# O1, O4 y entorno de O5 — evidencia

## Entorno (O5, Windows)

- Sesión: Claude Code en Orca, Windows 11 Pro 10.0.26300, modelo Opus 5.5.
- 2026-10-09, primer intento: `list_connected_browsers` → `[]`. El MCP `claude-in-chrome` sí carga sus herramientas en la sesión, pero no hay ninguna instancia de la extensión conectada a la cuenta. Bloqueo registrado; se pide al dev-lead que conecte Chrome.
- 2026-10-09, segundo intento, tras conectar el dev-lead la extensión: `list_connected_browsers` → 1 navegador (`Browser 1`, `osPlatform: Windows`, `isLocal: true`, `inUse: true`). `tabs_context_mcp` crea un grupo de pestañas propio de la sesión. Conexión desde Orca en Windows: **cumple**.
- Navegador: Chrome 155 (`navigator.userAgentData`: `Google Chrome 155`, Windows NT 10.0). Versión de la extensión: **no medida** (no se lee desde la página). Coste para el dev: instalar la extensión e iniciar sesión, una vez.

## App de las medidas

App desechable Vite 8.3.4 + React en el scratchpad de la sesión (fuera del repo), servida en `http://127.0.0.1:3456/` (enmienda de la spec, 2026-10-09). El primer puerto probado, 5199, falló con `Error: listen EACCES: permission denied ::1:5199`: está en un rango que Windows reserva (`netsh int ipv4 show excludedportrange protocol=tcp` → `5199 5298`). Para la 3.0.0: el puerto de un entorno puede caer en un rango reservado de Windows, y el error no lo dice.

## O1 — inyectar y leer sin copiar (simulado por Claude, 2026-10-09 ~10:48)

- Inyección: una llamada a `javascript_tool` con el contenido de `panel.js` y `mount` de 3 pruebas. `read()` devuelve las 3 en `pending`.
- El panel se ve abajo a la derecha, encima de la app (tema oscuro) y legible: el `all:initial` y el `z-index` máximo aíslan el CSS de la app. Captura: `C:\Users\pikac\AppData\Local\Temp\claude-chrome-screenshots-VC6joD\screenshot-1791535638376-0.jpg`.
- Clics reales de ratón (`computer left_click`) en OK de la 1 y la 2, y en KO de la 3, con el comentario escrito con el teclado. `read()` devuelve:

```json
[{"id":"t1","status":"ok","comment":"","markedAt":"2026-10-09T08:48:03.841Z"},
 {"id":"t2","status":"ok","comment":"","markedAt":"2026-10-09T08:48:03.965Z"},
 {"id":"t3","status":"ko","comment":"Guardar no guarda, sale error","markedAt":"2026-10-09T08:48:14.671Z"}]
```

- El comentario se guardaba en `change`, es decir, al salir del campo: si el dev escribía y decía «listo» sin salir, se perdía. Corregido en `panel.js` (se guarda en `input`, sin repintar para no perder el foco) tras la medida; la reinyección de la Ronda B usó aún la versión con `change`.
- **Resultado: cumple con clics simulados.** Falta confirmarlo con el dev-lead marcando a mano: no se ha comprobado que una persona lo use sin explicación.

## O1 — a mano, con el dev-lead (2026-10-09, 11:34-11:37 hora local)

- El dev-lead marcó a mano en el panel y escribió «listo». Claude leyó sin que pegara nada:

```json
[{"id":"h1","status":"ok","comment":"","markedAt":"2026-10-09T09:36:25.078Z"},
 {"id":"h2","status":"ok","comment":"","markedAt":"2026-10-09T09:37:18.943Z"},
 {"id":"h3","status":"ko","comment":"","markedAt":"2026-10-09T09:37:24.322Z"}]
```

- Junto al KO: `GET /api/missing · 500` (red armada antes de la prueba) y la captura `C:\Users\pikac\AppData\Local\Temp\claude-chrome-screenshots-VC6joD\screenshot-1791538672171-2.jpg`. La consola devolvió también el error de las 10:48, de la medida anterior: hay que leerla con `clear: true` al armarla, o filtrar por hora.
- Durante la prueba, el panel desapareció **dos veces** y el dev-lead tuvo que avisar: «el 2 perdona pero le di actualizar :D y se perdio» y «al hacer cerrar sesion y cvolver a entrar se pierde la ventanita». Las dos veces, la reinyección de una línea lo recuperó con las marcas intactas.
- **Resultado: cumple, salvo el comentario a mano**: cero copia y pega de resultados, pero el KO del dev-lead llegó sin comentario, así que el guardado del comentario en `input` (versión actual de `panel.js`) no está medido. Además, el dev tiene que avisar cada vez que una recarga se lleva el panel.

## O4 — espera sin tokens

`/cost` antes y después, pegados por el dev-lead:

| Lectura | Coste | Peticiones (main) | Salida Opus | Reloj de la sesión |
| --- | --- | --- | --- | --- |
| antes | $5.37 | 67 | 55.2k | 1h 11m 15s |
| después | $5.75 | 72 | 56.3k | 1h 13m 44s |

- Las 5 peticiones salen todas de mensajes del dev: 1 por la respuesta al primer `/cost` y 2 + 2 por los dos avisos de «se perdió el panel» (reinyección y respuesta). **Ninguna petición sin un mensaje del dev**: la espera en sí cuesta 0.
- Cada petición cuesta ~$0,076 ($0,38 / 5) con un contexto de ~140k tokens en caché; cada aviso de «se perdió el panel» son 2 peticiones, ~$0,15. El segundo `/cost` se tomó justo antes de escribir «listo», en el mismo mensaje: el turno de lectura del «listo» queda fuera del tramo.
- La prueba duró ~2,5 min de reloj, no los ≥ 5 min que pedía la spec. Con 0 peticiones sin mensaje, la duración no cambia el resultado, pero queda dicho.
- **Resultado: no cumple tal como se definió** (2,5 min, no ≥ 5). Lo medido: 0 peticiones sin un mensaje del dev en 2,5 min.
- Coste de lo que no es espera: la inyección completa son 3.033 bytes de código con el `panel.js` actual (~1k tokens, estimado a partir de los bytes, no contado); la reinyección desde `localStorage`, una línea (< 100 tokens); cada lectura de `read()` devuelve ~400 bytes.
