---
id: 20261009-082930-feature-0162-validation-panel-spike
title: Research — panel de validación inyectado con Claude in Chrome
spec: ./spec.md
status: draft
created: 2026-10-09
timeboxed: 2h
---

# Research — panel de validación inyectado con Claude in Chrome

## 1. Pregunta a resolver

¿Puede Claude in Chrome sustituir el «copia y pega» de la validación manual con un panel flotante inyectado en la app del proyecto?

### Objetivos medidos

App de las medidas: Vite + React desechable en `http://127.0.0.1:3456/` (enmienda de la spec). Sesión de Claude Code en Orca sobre Windows 11.

| Objetivo | Resultado | Evidencia |
| --- | --- | --- |
| O1 — inyectar y leer sin copiar | **cumple**: el dev-lead marcó a mano 2 OK y 1 KO, y Claude los leyó sin que pegara nada; tuvo que avisar dos veces de que el panel había desaparecido | [o1-read.md](probe/evidence/o1-read.md) |
| O2 — 10 recargas y una redirección | **cumple con reinyección**: el panel se pierde 10/10, el estado se recupera 10/10 y en la redirección; reinyectar es una línea | [o2-reloads.md](probe/evidence/o2-reloads.md) |
| O3 — KO con captura, consola y red | **cumple en parte**: consola con hora, red sin hora y solo desde la primera lectura, captura en disco pero del momento de leer | [o3-ko-context.md](probe/evidence/o3-ko-context.md) |
| O4 — espera sin tokens | **cumple para la espera**: 0 peticiones sin un mensaje del dev; cada aviso de recarga cuesta ~$0,08 (prueba de ~2,5 min, no ≥ 5) | [o1-read.md](probe/evidence/o1-read.md) |
| O5 — Orca en Windows | **cumple** tras conectar la extensión (primer intento: ningún navegador conectado); Mac en la lista de §4 | [o1-read.md](probe/evidence/o1-read.md) |

## 2. Opciones evaluadas

### 2.1 Opción A — Claude in Chrome con panel inyectado (medida)

- **Qué es**: Claude abre la app en el Chrome del dev, inyecta el panel con `javascript_tool`, lee `localStorage` y adjunta consola, red y captura con las herramientas de la extensión.
- **Pros**: sin código fuera del plugin; usa el Chrome y las sesiones del dev (ya logueado); el panel aguanta HMR y CSP `script-src 'self'`; la reinyección cuesta una línea; nada que instalar en el proyecto.
- **Contras** (medidos): el panel desaparece en cada recarga completa y solo vuelve cuando Claude tiene turno; la red no se registra hasta la primera lectura y no trae hora; la captura es la del momento de leer, no la del KO; depende de que la extensión esté conectada (primer intento: `[]`), de un plan de Claude con Claude in Chrome y de que la política de Chrome de la empresa permita la extensión.
- **Coste estimado**: 1-2 dev-días para llevar `panel.js` a la CLI y escribir la parte de la skill; ~1,5k tokens por inyección completa y < 100 por reinyección.

### 2.2 Opción B — extensión de Chrome propia que lee una lista de puertos (sobre el papel)

- **Qué es**: una extensión del equipo con un content script que se monta sola en los orígenes de una lista de puertos y guarda los resultados.
- **Pros**: el content script se reinyecta solo en cada carga, que es justo el contra de A; con `chrome.debugger` o `webRequest` puede registrar red y consola con hora; puede capturar la pestaña en el momento del KO (`chrome.tabs.captureVisibleTab`).
- **Contras**: código fuera del plugin, con su ciclo de publicación propio; la política de Chrome gestionada de la empresa puede bloquear extensiones fuera de la lista permitida o el modo desarrollador (instalar sin empaquetar); falta un canal hacia la sesión de Claude (fichero descargado, servidor local o native messaging, que pide instalar un host). Ojo: la política afecta igual a Claude in Chrome, que también es una extensión. Este riesgo no distingue A de B, salvo que Claude in Chrome ya esté permitida.
- **Coste estimado**: 3-5 dev-días más su mantenimiento, y gestión con TI para la lista permitida.

### 2.3 Opción C — página local servida por la CLI `sdd` (sobre el papel)

- **Qué es**: `sdd` levanta un servidor local con la lista de pruebas; el dev la tiene en otra pestaña, marca y la página escribe los resultados en un fichero que Claude lee.
- **Pros**: sin extensión ni política de Chrome; funciona en cualquier navegador y SO; el código vive en el plugin (CLI); los resultados en un fichero son evidencia durable.
- **Contras**: la página no ve la app (otro origen), así que no hay consola, ni red, ni captura automática: el dev vuelve a contar el error, solo que en un formulario en vez de en el chat; alterna entre dos pestañas.
- **Coste estimado**: 1-2 dev-días.

### 2.4 Opción D — Playwright con navegador visible que maneja el dev (propuesta del agente, no medida)

- **Qué es**: la CLI abre con Playwright un Chromium visible, lo maneja el dev a mano y Claude no ejecuta acciones. `addInitScript` monta el panel en cada carga; `exposeBinding` avisa de cada marca; `page.on('console')` y `page.on('response')` registran con hora; al marcar KO, el script hace la captura en ese momento y escribe todo en un fichero.
- **Pros**: resolvería los tres contras medidos de A (panel tras recarga sin turno de Claude, red desde el inicio y con hora, captura del momento del KO); sin extensión ni política de Chrome; Playwright ya está en el kit para la verificación visual.
- **Contras**: es un navegador aparte, sin las sesiones del dev, así que hay que volver a loguearse; un proceso de Node en segundo plano que hay que parar; descarga de Chromium si el proyecto no lo tiene.
- **Coste estimado**: 2-3 dev-días. **Sin medir**: no entra en la recomendación.

## 3. Recomendación

- **Elegida**: **A, Claude in Chrome**, para la validación manual de la 3.0.0. Con lo medido sustituye el copia y pega (O1, O2, O4 y O5) y adjunta consola y red al KO (O3 en parte). Su punto débil, medido con el dev-lead: en una prueba de 3 pasos, el panel desapareció 2 veces (F5 y login) y cada vez hizo falta un aviso y un turno. Tres reglas para la skill que salen de lo medido:
  1. Llamar a `read_network_requests` justo después de inyectar, para armar el registro de red.
  2. Al recibir «listo», o si el dev avisa de que el panel ha desaparecido, reinyectar con la línea de `localStorage` antes de leer.
  3. Decir en la validación que la captura es la del momento de leer.
- **Por qué**: es la única opción medida, cumple los objetivos que se pudieron medir y no añade código fuera del plugin.
- **Plan B**: **C**, la página servida por la CLI, si Claude in Chrome no está disponible (plan, política de la empresa o SO). Pierde el contexto automático del KO, pero no depende de nada externo.
- **Siguiente paso recomendado**: medir D en un spike corto antes de escribir la skill. Si cumple, sustituiría a A como opción principal: el remontado tras cada carga sin aviso es justo lo que falló con el dev-lead, y además no depende de una extensión y la captura es la del KO.

## 4. Spike

- **Branch**: `feature/0162-validation-panel-spike` · **Duración real**: ~1h 15m · **Resultado**: [`probe/`](probe/) (`panel.js` desechable y evidencia)
- **Aprendizajes clave**:
  - La reinyección barata existe: el panel guarda su propio código en `localStorage` y vuelve con `eval(localStorage.getItem('sdd-validation-panel-src'))`.
  - `read_network_requests` solo ve lo que pasa desde su primera llamada, y sin hora.
  - Un puerto de desarrollo en Windows puede caer en un rango reservado (`EACCES` en 5199, rango `5199-5298`).
  - El fallback de SPA de Vite devuelve 200 en rutas `/api/*` inexistentes: una prueba de «petición fallida» necesita un backend que falle de verdad.

### Comprobaciones para Claude Desktop en Mac (para un compañero)

1. En Claude Desktop, ¿la sesión de código tiene las herramientas `claude-in-chrome`? Apunta la versión de Claude Desktop y de la extensión.
2. `list_connected_browsers` devuelve tu Chrome con `osPlatform` de Mac y `inUse: true`. Si devuelve `[]`, apunta qué hiciste para conectarlo.
3. Levanta una app en un puerto libre. En macOS, el AirPlay Receiver ocupa el 5000 y el 7000: usa otro.
4. Inyecta `probe/panel.js` con `javascript_tool` y `mount` de 3 pruebas; marca 2 OK y 1 KO a mano; Claude lo lee con `read()`.
5. Haz 3 recargas con Cmd+R y comprueba que la línea de reinyección recupera el estado.
6. Arma la red (`read_network_requests`), provoca un 4xx/5xx y un `console.error`, y comprueba que salen en las lecturas.
7. Haz una captura con `save_to_disk` y apunta la ruta donde queda en macOS.
8. Con el turno de Claude terminado, prueba 5 min y comprueba con `/cost` que el contador no se movió.
9. Si la empresa gestiona Chrome en el Mac, comprueba en `chrome://policy` si la extensión Claude in Chrome está permitida.

## 5. Referencias

- Propuesta 0131 (carril spike): [proposal.md](../20261007-144256-proposal-0131-kit-rework/proposal.md)
- Herramientas usadas: `javascript_tool`, `computer` (screenshot, clic), `read_console_messages`, `read_network_requests`, `list_connected_browsers` del MCP `claude-in-chrome`.
