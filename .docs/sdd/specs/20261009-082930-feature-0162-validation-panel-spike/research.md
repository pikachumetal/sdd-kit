---
id: 20261009-082930-feature-0162-validation-panel-spike
title: Research — panel de validación inyectado con Claude in Chrome
spec: ./spec.md
status: done
created: 2026-10-09
timeboxed: 2h
---

# Research — panel de validación inyectado con Claude in Chrome

## 1. Pregunta a resolver

¿Puede Claude in Chrome sustituir el «copia y pega» de la validación manual con un panel flotante inyectado en la app del proyecto?

### Objetivos medidos

App de las medidas: Vite + React desechable en `http://127.0.0.1:3456/`, levantada por Claude (enmienda de la spec). Sesión de Claude Code en Orca sobre Windows 11, Chrome 155. Estados: **medido** (cumple o no cumple) o **no medido**.

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — inyectar y leer sin copiar | **cumple, salvo el comentario a mano** | El dev-lead marcó a mano 2 OK y 1 KO y Claude los leyó sin que pegara nada. Su KO llegó sin comentario: el comentario solo se midió con los clics de Claude y la versión antigua del panel (`change`); el guardado en `input` de `panel.js` actual no se ha medido | [o1-read.md](probe/evidence/o1-read.md) |
| O2 — 10 recargas y una redirección | **cumple** (con reinyección) | El panel se pierde 10/10 y el estado se recupera 10/10 y tras el login; reinyectar es una línea. Las recargas las hizo Claude, con el dev-lead ausente | [o2-reloads.md](probe/evidence/o2-reloads.md) |
| O3 — KO con captura, consola y red | **no cumple** | Sí funciona: la consola llega con hora, la petición fallida llega, la captura queda en disco. No cumple porque la red no trae hora y solo se registra desde la primera lectura, y la captura es la del momento de leer, no la del KO | [o3-ko-context.md](probe/evidence/o3-ko-context.md) |
| O4 — espera sin tokens | **no cumple tal como se definió** | La prueba duró ~2,5 min, no ≥ 5. En ese tramo hubo 0 peticiones sin un mensaje del dev; las 5 que hubo salen de sus mensajes (~$0,15 por cada aviso de «se perdió el panel») | [o1-read.md](probe/evidence/o1-read.md) |
| O5 — Orca en Windows | **cumple en conexión; versión de la extensión no medida** | Conecta tras instalar la extensión (primer intento: ningún navegador conectado); Chrome 155; la página no puede leer la versión de la extensión. Mac en la lista de §4 | [o1-read.md](probe/evidence/o1-read.md) |

### Review Focus del plan

| Entrada | Estado |
| --- | --- |
| 1. HMR de la app | **medido solo en Vite**: el panel sobrevive al HMR de Vite. El HMR o el live-reload de `ng serve` (las apps del equipo) **no medido** |
| 2. Redirección a otro origen (SSO externo) | **no medido**: solo se probó una redirección en el mismo origen |
| 3. CSS de la app tapando el panel | **cumple**: visible y legible sobre una app de tema oscuro |
| 4. Error de red o consola anterior atribuido al KO | **no cumple en consola**: la lectura a mano adjuntó un error de 1 h antes. **No alcanzable en red**: sin hora no se puede filtrar por la marca anterior |

## 2. Opciones evaluadas

### 2.1 Opción A — Claude in Chrome con panel inyectado (medida)

- **Qué es**: Claude abre la app en el Chrome del dev, inyecta el panel con `javascript_tool`, lee `localStorage` y adjunta consola, red y captura con las herramientas de la extensión.
- **Pros** (medidos): sin código fuera del plugin; usa el Chrome y las sesiones del dev; el panel aguanta el HMR de Vite y una CSP `script-src 'self'` en `<meta>`; reinyectar cuesta una línea; nada que instalar en el proyecto.
- **Contras** (medidos): el panel desaparece en cada recarga completa y solo vuelve cuando Claude tiene turno (2 veces en una prueba de 3 pasos con el dev-lead); la red no se registra hasta la primera lectura y no trae hora; la captura es la del momento de leer; la consola arrastra errores viejos si no se limpia. Depende de que la extensión esté conectada, de un plan de Claude con Claude in Chrome y de que la política de Chrome de la empresa la permita.
- **No medido**: CSP enviada por cabecera HTTP, apps Angular, SSO externo.
- **Coste estimado**: 1-2 dev-días para llevar `panel.js` a la CLI y escribir la parte de la skill; reinyectar, una línea por recarga, más el turno del aviso (~$0,15 con un contexto de ~140k tokens en caché).

### 2.2 Opción B — extensión de Chrome propia que lee una lista de puertos (sobre el papel)

- **Qué es**: una extensión del equipo con un content script que se monta solo en los orígenes de una lista de puertos y guarda los resultados.
- **Pros**: el content script se reinyecta solo en cada carga, que es justo el contra principal de A; con `chrome.debugger` o `webRequest` puede registrar red y consola con hora; puede capturar la pestaña en el momento del KO (`chrome.tabs.captureVisibleTab`).
- **Contras**: código fuera del plugin, con su propio ciclo de publicación; la política de Chrome gestionada de la empresa puede bloquear las extensiones fuera de la lista permitida o el modo desarrollador; falta un canal hasta la sesión de Claude (un fichero descargado, un servidor local o native messaging, que pide instalar un host). La política afecta igual a Claude in Chrome, que también es una extensión: este riesgo no distingue A de B, salvo que Claude in Chrome ya esté permitida.
- **Coste estimado**: 3-5 dev-días, más su mantenimiento y la gestión con TI de la lista permitida.

### 2.3 Opción C — página local servida por la CLI `sdd` (sobre el papel)

- **Qué es**: `sdd` levanta un servidor local con la lista de pruebas; el dev la tiene en otra pestaña, marca, y la página escribe los resultados en un fichero que Claude lee.
- **Pros**: sin extensión ni política de Chrome; vale para cualquier navegador y SO; el código vive en el plugin (la CLI); los resultados en un fichero son evidencia durable.
- **Contras**: la página no ve la app (es otro origen), así que no hay consola, ni red, ni captura automáticas: el dev vuelve a contar el error, ahora en un formulario en vez de en el chat. Además alterna entre dos pestañas.
- **Coste estimado**: 1-2 dev-días.

### 2.4 Opción D — Playwright con navegador visible que maneja el dev (propuesta del agente, no medida)

- **Qué es**: la CLI abre con Playwright un Chromium visible, lo maneja el dev a mano y Claude no ejecuta acciones. `addInitScript` monta el panel en cada carga, `exposeBinding` avisa de cada marca, `page.on('console')` y `page.on('response')` registran con hora, y al marcar KO el script hace la captura y lo escribe todo en un fichero.
- **Ventajas esperadas, sin medir**: atacaría los contras medidos de A; sin extensión ni política de Chrome; Playwright ya está en el kit para la verificación visual.
- **Contras**: un navegador aparte, sin las sesiones del dev (hay que volver a loguearse); un proceso de Node en segundo plano que hay que parar; descarga de Chromium si el proyecto no lo tiene.
- **Coste estimado**: 2-3 dev-días. **No entra en la recomendación.**

## 3. Recomendación

- **Elegida**: **A, Claude in Chrome**, para la validación manual de la 3.0.0. Con lo medido sustituye el copia y pega de los resultados (O1), recupera el estado tras recargas y redirecciones (O2) y conecta desde Orca en Windows (O5). No cumple el contexto completo del KO (O3) ni se midió una espera de ≥ 5 min (O4). La skill tiene que decirlo y aplicar estas cuatro reglas, que salen de lo medido:
  1. Llamar a `read_network_requests` justo después de inyectar, para armar el registro de red.
  2. Llamar a `read_console_messages` con `clear: true` al inyectar, para no adjuntar errores anteriores al KO.
  3. Al recibir «listo», o si el dev avisa de que el panel ha desaparecido, reinyectar con la línea de `localStorage` antes de leer.
  4. Decir en la validación que la captura es la del momento de leer, y que la red no trae hora.
- **Por qué**: es la única opción medida, cumple el objetivo central (cero copia y pega de resultados) y no añade código fuera del plugin.
- **Plan B**: **C**, la página servida por la CLI, si Claude in Chrome no está disponible (plan, política de la empresa o SO). Pierde el contexto automático del KO, pero no depende de nada externo.
- **Opcional**: un spike corto de D, con su fila en el roadmap, si el aviso tras cada recarga molesta en uso real. La decisión de la 3.0.0 no lo espera.

## 4. Spike

- **Branch**: `feature/0162-validation-panel-spike` · **Duración real**: ~1h 30m · **Resultado**: [`probe/`](probe/): `panel.js` desechable, la app mínima de prueba (`probe/app/`) y la evidencia
- **Aprendizajes clave**:
  - La reinyección barata existe: el panel guarda su propio código en `localStorage` y vuelve con `eval(localStorage.getItem('sdd-validation-panel-src')); sddValidationPanel.mount([])`.
  - `read_network_requests` solo ve lo que pasa desde su primera llamada, y sin hora; `read_console_messages` guarda los errores anteriores hasta que se limpia.
  - Un puerto de desarrollo en Windows puede caer en un rango reservado (`EACCES` en 5199, rango `5199-5298`), y el error no lo dice.
  - El fallback de SPA de Vite devuelve 200 en rutas `/api/*` inexistentes: una prueba de «petición fallida» necesita un backend que falle de verdad (`probe/app/vite.config.js`).

### Comprobaciones para Claude Desktop en Mac (para un compañero)

Desde la rama `feature/0162-validation-panel-spike` (o `develop`, tras el merge), carpeta `.docs/sdd/specs/20261009-082930-feature-0162-validation-panel-spike/`. Apunta cada resultado en un fichero `probe/evidence/mac.md` de esa carpeta, con la forma de `o1-read.md` (paso → resultado → hora), y devuélvelo en un ticket de `sdd-feedback`.

1. En Claude Desktop, ¿la sesión de código tiene las herramientas `claude-in-chrome`? Apunta la versión de Claude Desktop y la de la extensión (en `chrome://extensions`).
2. `list_connected_browsers` devuelve tu Chrome con `osPlatform` de Mac e `inUse: true`. Si devuelve `[]`, apunta qué hiciste para conectarlo.
3. Levanta la app de prueba: `npx vite probe/app --config probe/app/vite.config.js --port 3457 --strictPort --host 127.0.0.1`. En macOS el AirPlay Receiver ocupa el 5000 y el 7000: si el 3457 está ocupado, usa otro libre.
4. Que Claude inyecte el contenido de `probe/panel.js` con `javascript_tool`, seguido de `sddValidationPanel.mount([{id:'m1',title:'1'},{id:'m2',title:'2'},{id:'m3',title:'3'}])`, y llame a `read_network_requests` y a `read_console_messages` con `clear: true`. Marca a mano 2 OK y 1 KO **con comentario**, y Claude lo lee con `sddValidationPanel.read()`.
5. Haz 3 recargas con Cmd+R. Tras cada una, Claude reinyecta con `eval(localStorage.getItem('sdd-validation-panel-src')); sddValidationPanel.mount([])` y comprueba que el estado sigue.
6. Pulsa «Guardar (petición 500)» y «Exportar (error de consola)», y comprueba que salen en `read_network_requests` (`GET /api/missing · 500`) y en `read_console_messages` (`probe-app: fallo provocado al exportar`).
7. Una captura con `save_to_disk`: apunta la ruta donde queda en macOS.
8. Ejecuta `/cost`, deja el turno de Claude terminado, prueba ≥ 5 min sin escribir en la sesión y ejecuta `/cost` otra vez antes de decir «listo»: el número de peticiones no debe moverse.
9. Si la empresa gestiona Chrome en el Mac, comprueba en `chrome://policy` si la extensión Claude in Chrome está permitida.
10. Para la app: Ctrl+C en su terminal.

## 5. Referencias

- Propuesta 0131 (carril spike): [proposal.md](../20261007-144256-proposal-0131-kit-rework/proposal.md)
- Herramientas usadas: `javascript_tool`, `computer` (screenshot, clic), `read_console_messages`, `read_network_requests` y `list_connected_browsers` del MCP `claude-in-chrome`.
