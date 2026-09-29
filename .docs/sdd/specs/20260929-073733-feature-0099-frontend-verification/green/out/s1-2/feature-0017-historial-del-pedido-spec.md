---
id: 20260929-083547-feature-0017-historial-del-pedido
feature: 0017
title: Historial del pedido
mode: full
profile: delegate
status: draft
created: 2026-09-29
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Historial del pedido

## Capacidades

- Modificadas: `orders` — se añaden tres requisitos: el historial de cambios de estado, el historial de un pedido sin cambios y el 404 de un pedido que no existe.

## Decisiones que he tomado yo — valida estas

**Review de spec: ninguna**, por decisión del dev-lead al arrancar («sin review de spec»). No he aplicado la rúbrica de `review-spec.md`; el repaso de coherencia lo he hecho yo (ver la última decisión).

1. **Los datos salen de un campo `history` en cada pedido de `orders.mjs`.** Hoy un pedido no guarda sus cambios y no hay base de datos; el proyecto ya lee los pedidos de ese fichero. Cada entrada lleva estado anterior, estado nuevo, fecha y usuario. Datos de ejemplo: 1042 con 1 cambio, 1043 con ninguno, 1044 con 2 (ver escenarios).
2. **«Quién lo hizo» es el nombre de la persona** (`Marta Gil`, `Luis Prado`), no un correo ni un id: la interfaz es para el equipo comercial y no hay otro dato de usuario en el código.
3. **Solo cuentan los cambios de estado.** La creación del pedido no es una entrada; un pedido recién creado tiene historial vacío.
4. **Orden: el más reciente arriba**; es lo que el equipo comercial busca primero (¿cómo está ahora?).
5. **Fecha en formato `dd/mm/aaaa hh:mm`** (`11/09/2026 16:40`), sin zona horaria: el proyecto no muestra fechas en ningún sitio y no tiene una convención; esta es la habitual en castellano.
6. **Pedido inexistente → 404 con el mismo «No encontrado» que la ficha.** Sin sesión, la misma redirección al login que el resto de rutas: no cambia.
7. **La pantalla lleva un enlace «Volver al pedido <id>» a la ficha, pero la ficha NO enlaza al historial.** La fila del roadmap pide la pantalla, no el enlace; la ficha la está tocando la 0015 (tarjeta de resumen) en otro worktree y añadirle un enlace choca en `views.mjs` y en los tests. Consecuencia: hasta que alguien añada el enlace, la pantalla solo se alcanza por URL. **Si prefieres el enlace ya en esta feature, dímelo: es una línea en la ficha y un escenario más.**
8. **Ninguna capacidad nueva:** el historial es del pedido, va en `orders`.
9. **Tamaño: 3 tasks previstas, sin partir** (datos de ejemplo, vista, ruta), todas en la misma superficie (UI del servidor de Node), sin migración. Coincide con lo que pediste.
10. **Riesgo de colisión con la 0015 y la 0016** (ambas 🔄 en curso): las tres tocan `views.mjs`, `orders.mjs` y `tests/views.test.mjs`. Yo solo añado: una función `renderHistory`, un campo `history` y una ruta en `server.mjs`. Antes de despachar cada task comprobaré la base, como manda el kit; si otra feature ya cambió esos ficheros en `develop`, es un freno de alcance y paro.
11. **Propuesta de `§Frontend` para `tech-stack.md`** (esta feature añade una pantalla y `tech-stack.md` no la tiene; al aprobar la spec la escribo tal cual):
    - **URL**: `http://localhost:4652` (puerto de `app.config.json`).
    - **Detector**: `npx impeccable@<versión que se fije al instalarlo> detect {url} --viewport {viewport}`; falla con el código de salida 2. No he verificado que esa versión ni ese comando existan: la task lo comprobará y, si no ejecuta, lo visual queda «no probado» con el error. Si no lo quieres, dilo: queda `Detector: ninguno` y no se vuelve a proponer.
    - **Viewports**: `1280x800` y `390x844`.
    - **Runner E2E**: Playwright (`playwright` 1.63.0 ya está en `devDependencies`), con el MCP si está en la sesión y, si no, un script.
    - **Acceso**: la aplicación pide login (`login: impersonate` en `app.config.json`). Entrada: `/dev/impersonate?next={path}` (no lleva usuario: la sesión es genérica); sesión guardada en `.sdd-session.json` (`storageState`), que hay que añadir a `.gitignore`; se rehace entrando otra vez por la URL de entrada. Solo vale con `login: impersonate`: con `magic` hay un límite de 2 solicitudes por hora que el kit no debe gastar, y ahí lo visual queda «no probado».
    - **Temas**: `?theme=light` (por defecto) y `?theme=dark`.
    - **Pantalla de referencia**: la ficha, `/pedidos/1042`.
    - **Skills de apoyo**: ninguna.
12. **Repaso de coherencia:** los literales que se repiten (nombres, fechas y estados de los pedidos 1042, 1043, 1044 y 9999) coinciden entre las decisiones y los escenarios. No hay `MODIFIED`, así que no hay implementación de un requisito vigente que rastrear; el Scope lista los ficheros que se tocan.

### Decisiones tomadas con el dev-lead

- Perfil `delegate`, modo full, sin partir y sin review de spec — «Perfil delegate, modo full, sin partir y sin review de spec: escribe la spec y para en su gate.»

## Intent

Hoy la ficha del pedido dice en qué estado está, pero no cómo llegó ahí: para saber quién lo pasó a «Enviado» y cuándo, el equipo comercial tiene que preguntar. Se quiere una pantalla `/pedidos/<id>/historial` que liste los cambios de estado del pedido con su fecha y la persona que los hizo.

## Scope

- Entra:
  - Pantalla `/pedidos/<id>/historial` con los cambios de estado (estado anterior → nuevo, fecha, quién), el más reciente primero.
  - Mensaje para un pedido sin cambios.
  - 404 para un pedido que no existe.
  - Campo `history` en los pedidos de ejemplo de `orders.mjs`.
  - Ficheros que se tocan: `orders.mjs` (datos), `views.mjs` (`renderHistory`), `server.mjs` (ruta), `app.css` (estilos de la tabla si hacen falta), `tests/views.test.mjs` y un test de la ruta; `tech-stack.md` (`§Frontend`) y `.gitignore` (`.sdd-session.json`).
- No entra:
  - Enlace desde la ficha o el listado al historial (decisión 7).
  - Registrar los cambios al producirse: no hay forma de cambiar el estado en la aplicación, el historial se lee de los datos.
  - Cambios que no son de estado (líneas, total, urgente), filtros, paginación, exportación.
  - Zona horaria y formato de fecha configurables.

## Approach

El historial es una lista de entradas dentro de cada pedido. Una vista nueva, con la misma página base que el listado y la ficha (mismo CSS, mismos temas), la pinta como una tabla de tres columnas —Cambio, Fecha, Usuario—; la ruta la sirve si el pedido existe y con la misma sesión que las demás. Si la lista de entradas está vacía, en lugar de la tabla va un mensaje. El detalle (formato de fecha, nombres de función, orden de las tasks) es de `plan.md`.

## Delta de comportamiento

### Capacidad: `orders`

**ADDED — El historial muestra los cambios de estado del pedido**
- GIVEN el pedido 1044 de Electro Norte, que pasó de «Borrador» a «Pendiente de envío» el 10/09/2026 a las 09:15 por Marta Gil, y de «Pendiente de envío» a «Enviado» el 11/09/2026 a las 16:40 por Luis Prado
- WHEN se abre `/pedidos/1044/historial`
- THEN la cabecera muestra «Historial del pedido 1044»
- AND la tabla tiene dos filas, la primera `Pendiente de envío → Enviado · 11/09/2026 16:40 · Luis Prado` y la segunda `Borrador → Pendiente de envío · 10/09/2026 09:15 · Marta Gil`
- AND hay un enlace «Volver al pedido 1044» a `/pedidos/1044`

**ADDED — Un pedido sin cambios de estado tiene el historial vacío**
- GIVEN el pedido 1043 de Talleres Ruiz, en «Borrador», sin ningún cambio de estado
- WHEN se abre `/pedidos/1043/historial`
- THEN la pantalla muestra «Sin cambios de estado»
- AND no hay tabla

**ADDED — El historial de un pedido que no existe da 404**
- GIVEN que no existe el pedido 9999
- WHEN se abre `/pedidos/9999/historial`
- THEN la respuesta es 404 con el texto «No encontrado»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
