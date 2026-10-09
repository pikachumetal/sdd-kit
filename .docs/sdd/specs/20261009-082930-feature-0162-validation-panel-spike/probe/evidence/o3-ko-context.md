# O3 — KO con captura, consola y red

2026-10-09 ~10:48. Clics de Claude simulando al dev: «Guardar» (petición fallida), «Exportar» (error de consola) y KO en la prueba 3 con comentario.

| Pieza | Herramienta | Resultado | Hora |
| --- | --- | --- | --- |
| Estado del KO | `javascript_tool` → `read()` | `t3 · ko · «Guardar no guarda, sale error»` | `markedAt 2026-10-09T08:48:14.671Z` |
| Consola | `read_console_messages` (`onlyErrors`) | `[ERROR] probe-app: fallo provocado al guardar` | `10:48:14 AM` (hora local) |
| Red | `read_network_requests` (`urlPattern: /api/`) | `GET /api/missing · 500` | **sin hora**: la herramienta no la da |
| Captura | `computer screenshot` con `save_to_disk` | `C:\Users\pikac\AppData\Local\Temp\claude-chrome-screenshots-VC6joD\screenshot-1791535695460-1.jpg` | la del momento de la lectura |

## Hallazgos

1. **La red solo se registra desde la primera llamada a `read_network_requests`.** La primera petición fallida, anterior a esa llamada, no aparece («Network tracking starts when this tool is first called»). La sesión tiene que llamar a `read_network_requests` justo después de inyectar el panel, para armarla. Además, la lista se borra al navegar a otro dominio.
2. **La red no trae hora**: el KO solo se cruza con la red por orden, no por tiempo. La consola sí trae hora (local; `markedAt` va en UTC).
3. **La captura queda en disco**, en una carpeta temporal de la extensión, y es la del momento en que Claude lee, no la del momento del KO. Si el dev siguió navegando, la captura ya no muestra el fallo. Para la captura del momento haría falta que el panel la pidiera, y una página no puede capturarse a sí misma sin permisos.
4. Primer intento con Vite: `/api/missing` devolvía 200 (el fallback de SPA sirve `index.html`). Se añadió a la app un middleware que contesta 500 en `/api/*`. Era un defecto de la app de prueba, no del panel.

## Resultado

**No cumple**: el THEN pide cada pieza con su hora y la captura del momento. Sí llegan la consola con hora, la petición fallida (sin hora) y una captura en disco, pero de cuando lee Claude, no de cuando marca el dev.
