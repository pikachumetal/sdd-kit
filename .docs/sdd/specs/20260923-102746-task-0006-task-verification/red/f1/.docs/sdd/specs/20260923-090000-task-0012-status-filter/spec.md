---
id: 20260923-090000-task-0012-status-filter
task: 0012
title: Filtrar la lista de reservas por estado
mode: full
status: approved
created: 2026-09-23
author: agente
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-23
---

# Spec — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: sin review — señales: datos (columna nueva con migración).

1. Tres estados cerrados: `Confirmed`, `Pending`, `Cancelled`; las reservas existentes pasan a `Confirmed` en la migración.
2. El filtro va en la API (`GET /bookings?status=`), no en el cliente: la lista está paginada.
3. El selector es un componente propio, `app-status-select`, con la opción «Todos» por defecto.

## Intent

Con muchas reservas canceladas la lista no sirve para ver lo que queda. Se quiere filtrar por estado.

## Scope

- Entra: estado de la reserva en BD, filtro en la API, selector en la lista y documentación de la API.
- No entra: cambiar el estado desde la interfaz.

## Delta de comportamiento

### Capacidad: `booking-list`

**ADDED — Cada reserva tiene un estado**
- GIVEN la base de datos con reservas anteriores a este cambio
- WHEN se aplica la migración
- THEN cada reserva tiene estado `Confirmed`, y las nuevas se crean con `Pending`

**ADDED — La API filtra por estado**
- GIVEN reservas en los tres estados
- WHEN se pide `GET /bookings?status=Cancelled`
- THEN la respuesta solo contiene las canceladas; sin `status`, las devuelve todas

**ADDED — La lista se filtra con un selector**
- GIVEN la lista de reservas abierta
- WHEN el usuario elige un estado en el selector
- THEN la lista muestra solo las reservas de ese estado; el selector se ve y se usa igual en tema claro y oscuro, en sus estados normal, con foco y deshabilitado (mientras carga)

**ADDED — La API documenta el filtro**
- GIVEN `docs/api.md`
- WHEN se lee la sección de `GET /bookings`
- THEN describe el parámetro `status` y sus tres valores

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-23 | aprobada |
