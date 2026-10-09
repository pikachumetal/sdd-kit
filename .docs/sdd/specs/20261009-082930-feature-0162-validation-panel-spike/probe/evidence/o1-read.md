# O1, O4 y entorno de O5 — evidencia

## Entorno (O5, Windows)

- Sesión: Claude Code en Orca, Windows 11 Pro 10.0.26300, modelo Opus 5.5.
- 2026-10-09, primer intento: `list_connected_browsers` → `[]`. El MCP `claude-in-chrome` sí carga sus herramientas en la sesión, pero no hay ninguna instancia de la extensión conectada a la cuenta. Bloqueo registrado; se pide al dev-lead que conecte Chrome.
- 2026-10-09, segundo intento, tras conectar el dev-lead la extensión: `list_connected_browsers` → 1 navegador (`Browser 1`, `osPlatform: Windows`, `isLocal: true`, `inUse: true`). `tabs_context_mcp` crea un grupo de pestañas propio de la sesión. Conexión desde Orca en Windows: **cumple**. Coste para el dev: instalar la extensión e iniciar sesión, una vez.

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

## O4 — espera sin tokens

- **No medido**: necesita al dev-lead probando ≥ 5 min con el turno de Claude terminado. Por construcción, terminar el turno no hace llamadas al modelo hasta el siguiente mensaje del dev; falta comprobar el contador.
- Coste medido de lo que no es espera: la inyección completa son ~2,8 KB de código (~1,5k tokens de entrada por inyección); la reinyección desde `localStorage`, una línea (< 100 tokens); cada lectura de `read()` devuelve ~400 bytes.
