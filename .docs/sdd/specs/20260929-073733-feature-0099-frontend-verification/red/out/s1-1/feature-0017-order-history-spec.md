---
id: 20260929-075734-feature-0017-order-history
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

- Modificadas: `orders` — se añaden requisitos (solo `ADDED`): la pantalla de historial, su estado vacío y el 404 de un pedido que no existe.

## Decisiones que he tomado yo — valida estas

Review de spec: ninguna (la decide el dev-lead en el arranque) — señales: datos (un campo `history` nuevo en los pedidos) · tamaño: ~40 líneas en 4 ficheros de código

1. **Sin capacidad nueva**: el historial es parte de `orders` (listado y ficha de pedidos), no una capacidad aparte. Solo `ADDED`, ningún `MODIFIED`.
2. **Dónde viven los datos**: un campo `history` en cada pedido de `orders.mjs`, en memoria como el resto; la app no cambia estados hoy, así que el historial es de solo lectura.
3. **Qué es una entrada**: fecha y hora, estado al que pasó y quién lo hizo, ordenadas de la más antigua a la más reciente. Un pedido puede tener el historial vacío (el 1043, borrador sin cambios); no se inventa una entrada de «creación».
4. **Formato de fecha**: `dd/MM/yyyy HH:mm`, hora local sin zona.
5. **«Quién»**: el nombre de la persona del equipo comercial. Los nombres de los datos de ejemplo son inventados.
6. **No se enlaza desde la ficha**: la ficha la está tocando la 0015 (en curso) y el listado la 0016; enlazar aquí crearía conflicto. La pantalla se abre por URL y el enlace queda para una feature posterior. Es la decisión más discutible: dime si prefieres el enlace ahora.
7. **Pedido inexistente**: `/pedidos/<id>/historial` de un id que no existe responde 404 «No encontrado», como la ficha.
8. **Sesión y tema**: la pantalla exige sesión igual que el resto y respeta `?theme=dark`.
9. **Corregido en el repaso de coherencia**: la decisión 3 decía que la primera entrada era la creación del pedido, y el escenario del 1043 (borrador con historial vacío) la contradecía; ahora un historial vacío es válido.

## Intent

Hoy la ficha muestra solo el estado actual del pedido. El equipo comercial no ve por qué estados ha pasado, cuándo ni quién los cambió. La 0017 añade una pantalla de solo lectura, `/pedidos/<id>/historial`, con esos cambios de estado.

## Scope

- Entra: campo `history` en los datos de ejemplo (`orders.mjs`); vista del historial (`views.mjs`); ruta `/pedidos/<id>/historial` (`server.mjs`); estilos de la tabla si hacen falta (`app.css`); tests (`tests/views.test.mjs`); requisitos nuevos en `capabilities/orders.md`.
- No entra: enlace desde la ficha o el listado; registrar cambios reales de estado (la app no los hace); filtros, paginación o exportación; el resumen (0015) y el badge de urgentes (0016).

## Approach

Cada pedido lleva su lista `history`. Una función de vista nueva pinta la tabla `Fecha · Estado · Quién`, con la misma cabecera y estilo que la ficha, y un mensaje cuando la lista está vacía. El servidor resuelve la ruta con el mismo patrón que la ficha (busca el pedido por id; sin él, 404). El cómo va en `plan.md`.

## Delta de comportamiento

### Capacidad: `orders`

**ADDED — El historial muestra los cambios de estado del pedido**
- GIVEN el pedido 1044 de Electro Norte, con historial: 15/09/2026 09:10 «Borrador» por Marta Vidal · 16/09/2026 11:45 «Pendiente de envío» por Marta Vidal · 18/09/2026 16:20 «Enviado» por Raúl Soto
- WHEN se abre `/pedidos/1044/historial`
- THEN la cabecera muestra «Historial del pedido 1044»
- AND la tabla lista, de la más antigua a la más reciente, `15/09/2026 09:10 · Borrador · Marta Vidal`, `16/09/2026 11:45 · Pendiente de envío · Marta Vidal` y `18/09/2026 16:20 · Enviado · Raúl Soto`

**ADDED — Un pedido sin cambios registrados lo dice**
- GIVEN el pedido 1043 de Talleres Ruiz, con `history` vacío
- WHEN se abre `/pedidos/1043/historial`
- THEN la cabecera muestra «Historial del pedido 1043» y en lugar de la tabla el texto «Este pedido no tiene cambios de estado registrados»

**ADDED — El historial de un pedido que no existe da 404**
- GIVEN que no existe el pedido 9999
- WHEN se abre `/pedidos/9999/historial`
- THEN la respuesta es 404 con el texto «No encontrado»

**ADDED — El historial respeta el tema oscuro**
- GIVEN el pedido 1044
- WHEN se abre `/pedidos/1044/historial?theme=dark`
- THEN la página lleva la clase `theme-dark` y el texto de la tabla tiene contraste ≥ 4,5:1 sobre el fondo

**Reglas de la capacidad**
- **Dónde viven los datos**: campo `history` de cada pedido en `orders.mjs`, lista de `{ date, status, by }`, de la más antigua a la más reciente.
- **Idioma de los nombres**: textos de interfaz en castellano; los nombres de campo, en inglés como los existentes.
- **Límites**: no aplica.
- **Avisos**: «Este pedido no tiene cambios de estado registrados» cuando `history` está vacío.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
