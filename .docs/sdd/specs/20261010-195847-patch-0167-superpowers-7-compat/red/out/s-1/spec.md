---
id: 20261010-200022-feature-0013-contador-reservas
feature: 0013
title: Que la lista de reservas diga cuántas reservas hay
mode: full
profile: delegate
status: draft
created: 2026-10-10
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Que la lista de reservas diga cuántas reservas hay

## Capacidades

- Nuevas: `bookings-list` — la lista de reservas y lo que muestra y devuelve (no hay carpeta `capabilities/` todavía; esta feature la crea con el comportamiento nuevo).

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva, contrato público (la respuesta de `GET /bookings` gana una cabecera) · tamaño: ~35 líneas en 4 ficheros (endpoint, componente, sus dos tests, `docs/api.md`)
- Mínimo razonable: ninguna — deja sin mirar si la cabecera nueva choca con algún consumidor de la API que no esté en este repo.

1. **«Cuántas» es el total de reservas, no las de la página.** La API devuelve 20 por página y la lista del frontend solo pide la primera; contar los `<li>` diría «20» con 45 reservas. Se muestra el total de la tabla.
2. **El total viaja en una cabecera `X-Total-Count`, el cuerpo sigue siendo el mismo array.** Cambiar el cuerpo a `{ items, total }` rompería a cualquier consumidor actual de `GET /bookings`; la cabecera es compatible. Alternativa descartada: endpoint aparte `/bookings/count` (dos peticiones por pantalla).
3. **Texto en castellano y singular/plural**: «0 reservas», «1 reserva», «45 reservas», en un párrafo sobre la lista. El texto exacto no lo fijó nadie; es mío.
4. **Si la petición falla o aún no ha llegado, no se muestra el contador** (ni «0 reservas»): un cero falso es peor que nada.
5. **No hay filtro por estado en esta rama.** El roadmap marca la 0012 como ✅, pero el código de `feature/0013` no tiene filtro, así que el total es el de todas las reservas. Si el filtro llega a la base antes de esta feature, el contador debería contar lo filtrado: lo vería el freno de alcance de la base, no esta spec.
6. **Capacidad nueva `bookings-list`**: hoy `.docs/sdd/` no tiene `capabilities/`; el nombre es kebab-case en inglés porque es nombre de fichero.
7. **Sin cambios de schema ni migración**: el total es un `CountAsync` sobre la tabla existente.

## Intent

Hoy la lista muestra como mucho 20 reservas, sin decir si hay más. Quien la mira no sabe si ve «todas» o solo la primera página. Se quiere que la lista diga cuántas reservas hay en total.

## Scope

- Entra: `GET /bookings` devuelve el total en la cabecera `X-Total-Count` (en cualquier página); la lista muestra «N reservas» encima; `docs/api.md` documenta la cabecera.
- No entra: paginación en la interfaz, filtro por estado, cambiar el cuerpo de la respuesta, un endpoint de recuento aparte, «mostrando X de Y».

## Approach

El backend cuenta las filas con la misma consulta de origen y añade la cabecera; el frontend lee la cabecera de la respuesta que ya pide y la pinta con el singular o el plural que toca. Sin petición nueva.

## Delta de comportamiento

### Capacidad: `bookings-list`

**ADDED — La API informa del total de reservas**
- GIVEN 45 reservas guardadas
- WHEN `GET /bookings?page=1`
- THEN la respuesta trae 20 reservas en el cuerpo y la cabecera `X-Total-Count: 45`
- AND `GET /bookings?page=3` trae 5 reservas y `X-Total-Count: 45`

**ADDED — La API informa del total con la lista vacía**
- GIVEN ninguna reserva guardada
- WHEN `GET /bookings`
- THEN el cuerpo es `[]` y la cabecera es `X-Total-Count: 0`

**ADDED — La lista muestra cuántas reservas hay**
- GIVEN la API responde con 20 reservas y `X-Total-Count: 45`
- WHEN se muestra la lista de reservas
- THEN el texto de la lista incluye «45 reservas» y se ven 20 filas
- AND con `X-Total-Count: 1` el texto es «1 reserva»
- AND con `X-Total-Count: 0` el texto es «0 reservas»

**ADDED — Sin total no hay contador**
- GIVEN la petición está en curso o ha fallado con un 500
- WHEN se muestra la lista de reservas
- THEN no aparece ningún texto de recuento

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
