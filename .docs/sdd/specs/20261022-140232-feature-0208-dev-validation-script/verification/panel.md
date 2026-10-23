# Verificación a mano del panel de validación (feature 0208, Task 3)

2026-10-22, kit de la rama (`validation-panel.js` de `ef2e32cc`, servidor de `ad0aadfe`). La app es `probe/app` del spike de la 0162, servida por un servidor mínimo de Node en `http://127.0.0.1:3461/` con `/api/*` → 500, el mismo middleware de su `vite.config.js` (Vite no está instalado en el repo).

**Desvío de la decisión 10 de la spec**: la extensión de Claude in Chrome no estaba conectada (`list_connected_browsers` → `[]`; `tabs_context_mcp` → «Browser extension is not connected»), y el dev-lead estaba ausente para conectarla. Lo que depende del panel se midió con el Chromium del MCP de Playwright, inyectando el mismo código con `browser_evaluate`. Las cuatro reglas que dependen de las herramientas de Claude in Chrome (`read_network_requests`, `read_console_messages` con `clear: true`, la captura de `computer` y el aviso) quedan `no probado`. Su comportamiento ya lo midió el spike de la 0162 (O1-O3), y esta feature no lo cambia.

| Paso | Resultado | Hora (UTC) |
| --- | --- | --- |
| Inyectar el panel y `mount('0208', 3 pasos)` | `read()` da los 3 en `pending`, sin `markedAt` | 15:09 |
| Marcar con clics reales OK, OK y KO, con el comentario «no vuelve al login» | marcas guardadas en `sdd-validation-0208` | 15:09 |
| Recarga 1, 2 y 3, con `eval(localStorage.getItem('sdd-validation-panel-src')); sddValidationPanel.mount('0208')` | 3 de 3: sin panel tras la recarga; tras reinyectar, `1:ok`, `2:ok`, `3:ko:no vuelve al login`, con `markedAt` | 15:10 |
| KO con contexto: «Guardar (petición 500)» y «Exportar (error de consola)» | consola del navegador: `500 … /api/missing` y `probe-app: fallo provocado al exportar`; captura en [panel-ko.png](panel-ko.png), con el panel y sus marcas sobre la app | 15:10 |
| Segunda validación en el mismo origen: `mount('0209', [1 paso])` | empieza de cero (`1:pending:otro paso`); la `0208` conserva sus 3 marcas | 15:10 |
| `clear()` | ninguna clave `sdd-validation-` y el panel retirado | 15:10 |
| Plan B: `sdd validation serve --steps pasos.json --out .temp/validation/0208.json` y la página en el navegador, con clics reales: OK en el paso 1, y KO con «sale cancelada» en el paso 2 | `0208.json` da `1:ok` y `2:ko:sale cancelada`, con `markedAt`; al parar por PID, el puerto queda libre | 15:10 |
| Consola de la página del plan B | un 404 de `favicon.ico`: arreglado con un icono vacío (`data:,`) en la página (ruling de la Task 1) | 15:10 |

- `read_network_requests` justo después de inyectar · no probado: sin la extensión
- `read_console_messages` con `clear: true` · no probado: sin la extensión
- Captura con `computer` (`screenshot`) · no probado: sin la extensión; la captura de arriba es de Playwright
- Inyección fallida por una CSP y paso al plan B · no probado: la app del spike no envía CSP
