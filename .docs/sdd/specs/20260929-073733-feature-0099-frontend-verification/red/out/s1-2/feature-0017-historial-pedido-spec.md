---
id: 20260929-080338-feature-0017-historial-pedido
feature: 0017
title: Historial del pedido
mode: full
profile: delegate
status: draft
created: 2026-09-29
author: Fixture
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Historial del pedido

> **Estado**: draft — en espera de aprobación del dev-lead.
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `orders` — añade dos requisitos (la pantalla de historial y el enlace desde la ficha); no cambia ninguno de los vigentes.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: datos (historial nuevo por pedido; 1 de 8) · tamaño: ~40 líneas en 4 ficheros
- Mínimo razonable: ninguna — es el nivel más bajo; deja sin mirar que un segundo lector contraste la spec con el enunciado (la 3 y la 4 de abajo son las que más lo necesitan).

1. **El historial son datos de ejemplo dentro de cada pedido** (`history` en `orders.mjs`), no un registro real — hoy ninguna pantalla cambia el estado de un pedido (el botón «Enviar» no hace nada), así que no hay dónde registrar un cambio. Cuando exista la acción que cambia el estado, escribir en el historial será otra feature. Cuesta si me equivoco: si el comercial esperaba un registro vivo, esta pantalla enseñará datos fijos.
2. **Cada entrada muestra fecha y hora, estado anterior → estado nuevo, y quién**, con la forma `dd/MM/yyyy HH:mm · <antes> → <después> · <quién>` que usan los escenarios. «Fecha» del enunciado lo leo como fecha y hora (`19/09/2026 10:05`), porque un pedido puede cambiar dos veces el mismo día.
3. **Orden: la más reciente primero.** El enunciado no lo dice; es lo que el comercial busca al abrir la pantalla (el último estado y quién lo puso).
4. **«Quién» es el nombre de la persona** guardado en la entrada. La aplicación no tiene usuarios (el login solo crea una sesión), así que no hay de dónde sacar el autor real.
5. **Un pedido sin cambios muestra «Este pedido no tiene cambios de estado»** en vez de una tabla vacía. El 1043 (borrador sin líneas) lo ejercita.
6. **Un pedido que no existe da el 404 que ya hay** («No encontrado»); no se crea una página de error nueva. La pantalla queda tras el login igual que el resto, sin regla propia.
7. **La ficha gana un enlace «Ver historial»**, y el historial uno «Volver al pedido <id>». El enunciado solo pide la pantalla, pero sin enlace nadie la encuentra. Es lo único que toca la ficha.
8. **Sin capacidad nueva**: el historial es parte de la ficha del pedido, así que sus requisitos entran en `orders`. El «Propósito» de `orders` habla de «listado y ficha»; lo dejo como está porque el historial cuelga de la ficha.
9. **Solape con la 0015 y la 0016**: las dos están en curso. Por su enunciado, la 0015 añade una tarjeta a la ficha y la 0016 un badge al listado, así que lo probable es que las tres toquen `views.mjs` y que el conflicto de merge caiga en `renderDetail`, donde va mi enlace. El roadmap no declara ficheros por fila: solape no comprobable.
10. **Corregido en el repaso de coherencia, sin review**: quité una línea del Scope que duplicaba los datos de ejemplo, cambié «fila de tabla» por la forma textual que ya usaban los escenarios (y con ella «reutiliza las clases de la tabla» por «sin estilos nuevos») y bajé a «probable» lo que de la 0015 y la 0016 solo sé por su enunciado.

### Decisiones tomadas con el dev-lead

- Perfil `delegate`, modo full, sin partir la feature y sin review de spec; la spec para en su gate — «Perfil delegate, modo full, sin partir y sin review de spec: escribe la spec y para en su gate».

## Intent

Hoy la ficha de un pedido muestra su estado actual, pero no cómo llegó a él. El equipo comercial no puede saber cuándo pasó a «Pendiente de envío» ni quién lo envió. Se quiere una pantalla `/pedidos/<id>/historial` con los cambios de estado del pedido, con fecha y con quién los hizo.

## Scope

- Entra: la ruta `/pedidos/<id>/historial` y su vista, con los cambios de estado, fecha y hora, y autor.
- Entra: `history` en los tres pedidos de ejemplo de `orders.mjs` (1042, 1043 y 1044).
- Entra: el enlace «Ver historial» en la ficha y el de vuelta en el historial.
- No entra: registrar cambios reales de estado (no hay acción que los produzca).
- No entra: usuarios, permisos o roles; filtros, paginación o exportación del historial.
- No entra: cambios en el listado ni en la tarjeta de resumen de la 0015.
- Ficheros que toca: `views.mjs` (vista del historial y el enlace de la ficha), `server.mjs` (la ruta), `orders.mjs` (datos), `tests/views.test.mjs`. `app.css` queda fuera: sin estilos nuevos. `README.md` y `app.config.json` no cambian.

## Approach

El historial se lee del propio pedido y se pinta en una vista nueva, igual que la ficha. La ruta cuelga de la del pedido y usa la misma búsqueda por id y el mismo 404. El tema claro/oscuro (`?theme=dark`) funciona como en el resto de pantallas. Los tests van sobre la vista, como el resto del proyecto (`tech-stack.md`), y la ruta se ve en la validación arrancando la aplicación.

## Delta de comportamiento

### Capacidad: `orders`

**ADDED — El historial lista los cambios de estado del pedido**
- GIVEN el pedido 1044 de Electro Norte, que pasó de «Borrador» a «Pendiente de envío» el 18/09/2026 16:40 por Marta Gil, y de «Pendiente de envío» a «Enviado» el 19/09/2026 10:05 por Pablo Ortega
- WHEN se abre `/pedidos/1044/historial`
- THEN la cabecera muestra «Historial del pedido 1044»
- AND la primera entrada es «19/09/2026 10:05 · Pendiente de envío → Enviado · Pablo Ortega»
- AND la segunda es «18/09/2026 16:40 · Borrador → Pendiente de envío · Marta Gil»

**ADDED — Un pedido sin cambios de estado lo dice**
- GIVEN el pedido 1043, sin ningún cambio de estado
- WHEN se abre `/pedidos/1043/historial`
- THEN la pantalla muestra «Este pedido no tiene cambios de estado» y ninguna entrada

**ADDED — El historial de un pedido que no existe da 404**
- GIVEN que no existe el pedido 9999
- WHEN se abre `/pedidos/9999/historial`
- THEN la respuesta es un 404 con «No encontrado»

**ADDED — La ficha y el historial se enlazan**
- GIVEN el pedido 1042
- WHEN se abre `/pedidos/1042`
- THEN la ficha muestra un enlace «Ver historial» a `/pedidos/1042/historial`
- AND en `/pedidos/1042/historial` hay un enlace «Volver al pedido 1042» a `/pedidos/1042`

**Reglas de la capacidad**
- **Dónde viven los datos**: cada pedido lleva su `history` en `orders.mjs`; cada entrada tiene fecha y hora, estado anterior, estado nuevo y autor.
- **Idioma de los nombres**: castellano en la interfaz (constitution).
- **Límites**: no aplica.
- **Avisos**: «Este pedido no tiene cambios de estado».
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
