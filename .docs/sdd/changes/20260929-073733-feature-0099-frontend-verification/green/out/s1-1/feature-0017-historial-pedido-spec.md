---
id: 20260929-083406-feature-0017-historial-pedido
feature: 0017
title: Historial del pedido
mode: full
profile: delegate
status: draft
created: 2026-09-29
author: Claude
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Historial del pedido

## Capacidades

- Modificadas: `orders` — se añaden dos requisitos: la pantalla del historial de un pedido y su estado vacío. Ningún requisito vigente cambia.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 1 (datos: el historial es un dato nuevo del pedido) · tamaño: ~40 líneas en 4 ficheros (`orders.mjs`, `views.mjs`, `server.mjs`, `app.css`), más tests
- Mínimo razonable: ninguna (es el nivel propuesto, y lo pidió el dev-lead al arrancar) — deja sin cubrir que nadie más relee la spec; por eso he hecho el repaso de coherencia yo (sin hallazgos que cambiaran un literal).

1. **No hay capacidad nueva**: el historial es parte de lo que la ficha de pedidos muestra, así que va como `ADDED` en `orders` — un pedido tiene un solo sitio donde mirar qué hace el sistema con él.
2. **El historial es un dato del pedido** (`history` en cada pedido de `orders.mjs`, junto a `lines`), con fecha, estado anterior, estado nuevo y autor. No hay base de datos ni escritura: hoy los pedidos son un fichero de datos y el historial sigue ese mismo criterio. Registrar cambios de estado nuevos (que «Enviar» añada una entrada) **no entra**: el enunciado de la fila pide mostrar los cambios, no producirlos.
3. **Orden: el cambio más reciente arriba.** El enunciado no lo fija; el equipo comercial abre el historial para saber qué pasó último.
4. **Formato de fecha `dd/mm/aaaa hh:mm`**, sin zona horaria, en castellano como el resto de la interfaz (constitution). «Quién» se muestra como el nombre de la persona, tal cual viene del dato.
5. **Sin cambios: estado vacío «Sin cambios de estado todavía»** en vez de una tabla vacía. El pedido 1043 (borrador, sin líneas) lo ejercita.
6. **Pedido inexistente: 404 «No encontrado»**, el mismo cuerpo que ya devuelve la ficha. **Sin sesión: 302 a `/login`**, comportamiento vigente del servidor que esta pantalla hereda sin tocarlo.
7. **Sin enlace desde la ficha ni desde el listado — la pantalla se abre por su URL.** Las features 0015 (tarjeta de resumen de la ficha) y 0016 (badge del listado) están en curso y editan `renderDetail` y `renderList` en `views.mjs`; meter un enlace ahí choca con ellas y el enunciado solo pide la pantalla. Es la decisión que más conviene que valides: si la quieres alcanzable desde la ficha, va como feature aparte tras cerrar la 0015.
8. **La pantalla reutiliza el estilo de la aplicación** (tabla `.lineas`, tema claro/oscuro con `?theme=dark`); no se introducen colores ni componentes nuevos. Se verifica con lo que propongo en los puntos 9 y 11.
9. **Propuesta de `§Frontend` para `tech-stack.md`** (la feature cambia lo que se ve y `tech-stack.md` no la tiene; al aprobar la spec la escribo):
   - URL: `http://localhost:4651` (puerto de `app.config.json`), arrancada con `node server.mjs`.
   - Detector: `npx impeccable@4.1.0 detect {url} --viewport {viewport}`; cuenta como fallo el código de salida 2.
   - Viewports: `1280x800` y `390x844`.
   - Runner E2E: Playwright (ya es `devDependency`, 1.63.0): el MCP si está en la sesión, si no un script con el paquete.
   - Acceso: `/dev/impersonate?next={path}` abre la sesión y redirige a `{path}` (`config.login = impersonate`). El servidor ignora el usuario, así que no hay usuario de pruebas que declarar. `storageState` en `.playwright/session.json`, que hay que añadir a `.gitignore` (hoy no lo está); se rehace pasando otra vez por la URL de entrada. El detector escanea siempre la URL de entrada con `next=/pedidos/1042/historial`.
   - Temas: claro por defecto; oscuro con `?theme=dark`.
   - Pantalla de referencia: la ficha `/pedidos/1042`.
   - Skills de apoyo: ninguna.
10. **Datos de ejemplo del historial** (en `orders.mjs`): 1042 con una entrada, 1043 sin ninguna, 1044 con dos. Son ficticios, como el resto de la fixture; nombres «Marta Gil» y «Luis Prats».
11. **Criterio de verificación visual** (irá en el campo «Verificación visual» del plan): la pantalla muestra un `<h1>` «Historial del pedido 1042», una tabla con columnas Fecha · De · A · Quién con una fila por cambio, y en el pedido sin cambios el texto del estado vacío en lugar de la tabla; en oscuro el texto y el borde de la tabla siguen los colores del tema.

## Intent

El listado y la ficha muestran el estado actual de un pedido, pero no cómo llegó a él. El equipo comercial no puede saber cuándo pasó a «Pendiente de envío» ni quién lo hizo sin preguntar. Se quiere una pantalla `/pedidos/<id>/historial` con los cambios de estado, su fecha y quién los hizo.

## Scope

- Entra: la pantalla `/pedidos/<id>/historial` con la lista de cambios de estado (fecha, de, a, quién), más reciente arriba; su estado vacío; el 404 de un pedido inexistente; el historial como dato de los pedidos de ejemplo; la sección `§Frontend` en `tech-stack.md` y la ruta de sesión en `.gitignore`.
- No entra: enlaces desde la ficha o el listado (decisión 7); que «Enviar» u otra acción registre cambios nuevos (decisión 2); filtros, paginación o exportación del historial; cambios en la ficha, el listado o el login.
- Ficheros que implementan lo que cambia (el delta es solo `ADDED`, no hay `MODIFIED`): `orders.mjs` (dato), `views.mjs` (`renderHistory`, función nueva; no se editan `renderList` ni `renderDetail`), `server.mjs` (una ruta nueva junto a la de la ficha), `app.css` (solo si el estado vacío necesita una regla), `tests/`.

## Approach

Una función de vista nueva, `renderHistory(order, theme)`, que pinta la tabla o el estado vacío con el estilo de la ficha, y una ruta `/pedidos/<id>/historial` en el servidor que la usa después de la comprobación de sesión existente. El historial se guarda en cada pedido como lista ya ordenada de más antiguo a más reciente, y la vista la invierte para mostrarla. Los escenarios se prueban con `node --test` sobre la vista, y la ruta (404, sesión) con una petición real al servidor arrancado en la validación.

## Delta de comportamiento

### Capacidad: `orders`

**ADDED — El historial lista los cambios de estado del pedido**
- GIVEN el pedido 1044 de Electro Norte, con dos cambios de estado: el 22/09/2026 10:05 de «Borrador» a «Pendiente de envío» por Marta Gil, y el 23/09/2026 16:40 de «Pendiente de envío» a «Enviado» por Luis Prats
- WHEN se abre `/pedidos/1044/historial`
- THEN el título es «Historial del pedido 1044»
- AND la tabla tiene dos filas, primero `23/09/2026 16:40 · Pendiente de envío · Enviado · Luis Prats` y debajo `22/09/2026 10:05 · Borrador · Pendiente de envío · Marta Gil`

**ADDED — Un pedido sin cambios de estado muestra el historial vacío**
- GIVEN el pedido 1043, sin cambios de estado
- WHEN se abre `/pedidos/1043/historial`
- THEN la pantalla muestra «Sin cambios de estado todavía» y no hay tabla

**ADDED — El historial de un pedido inexistente no se encuentra**
- GIVEN que no existe el pedido 9999
- WHEN se abre `/pedidos/9999/historial`
- THEN la respuesta es 404 con «No encontrado»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
