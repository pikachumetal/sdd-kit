---
id: 20260926-090000-feature-0011-site-code-field
feature: 0011
title: La sede de origen como campo propio
mode: full
status: draft
created: 2026-09-26
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — La sede de origen como campo propio

## Capacidades

- Modificadas: `bookings` — el portal recibe la sede de la reserva

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (siete puntos) — señales: contrato público (`GET /api/bookings` lo consume el portal) + MODIFIED (`El portal del cliente lista sus reservas`) + datos (columna `site`, migración `db/002-site.sql`) · tamaño: ~4 líneas en 2 ficheros
- Un solo revisor con los siete puntos: delta pequeño con contrato público + datos baja de dos revisores a uno, nunca a ninguno.
- Activada sin preguntar: estabas en reunión y pediste que decidiera las decisiones que faltan; un revisor no es paralelizar.

1. Columna nueva `site` en `bookings` (migración `db/002-site.sql`), con `site` derivado del prefijo que ya tiene `code`: sin prefijo → `local`; con prefijo `<SEDE>-` (p. ej. `MAD-`) → `<SEDE>` (p. ej. `MAD`). Así las reservas importadas ya existentes quedan con su sede de origen, no con `local`.
2. El portal recibe un campo nuevo `site` en `GET /api/bookings`; los campos que ya recibe no cambian.
3. Reglas de la capacidad para el dato `site`: ver «Reglas de la capacidad» en el delta — el catálogo de valores es el mismo que ya usa el prefijo de `code` (hoy: `local` o `MAD`), y ante discrepancia manda el prefijo de `code`.

### Hallazgos de la review

- **Aceptado** — el valor de `site` (`MAD`) no tiene catálogo declarado → decisión 1 y 3 fijan que el catálogo es el mismo prefijo que ya usa `code`, y se declara en «Reglas de la capacidad».
- **Aceptado** — la migración con `site = local` para todas las filas existentes deja mal etiquetadas las reservas ya importadas → decisión 1 corregida: `site` se deriva del prefijo existente en `code`, no un valor fijo.
- **Aceptado** — faltaba la sección «Reglas de la capacidad» para el dato nuevo `site` → añadida en el delta con las cinco entradas.
- **Aceptado** — el Intent dice que el portal quiere mostrar la sede, pero el Scope no dice si el frontend del portal entra → añadida línea explícita en «No entra».
- **Rechazado** — el escenario no lista un campo `end` → el schema de `bookings` (`db/001-bookings.sql`) no tiene columna `end`; la lista `code`, `customer`, `day`, `start`, `site` ya es exhaustiva frente al modelo real.
- **Rechazado** — el ejemplo usa `Madrid`/`MAD` como sede → no identifica cliente ni persona real; ya es el mismo ejemplo que usa `capabilities/bookings.md` para el prefijo de código, así que es consistente con el dominio, no un dato inventado nuevo.

## Intent

El portal del cliente quiere mostrar en qué sede es cada reserva, y hoy tendría que deducirlo del prefijo del código.

## Scope

- Entra: la columna `site` con su valor derivado del prefijo de `code` (`db/002-site.sql`, unas pocas líneas) y el campo `site` en `bookingToJson` (`src/api.js`, una línea).
- No entra: cambiar el código de reserva; mostrar la sede en recepción; el consumo del campo `site` en el frontend del portal (queda para cuando el portal lo necesite).

## Approach

Guardar la sede al crear o importar la reserva y devolverla en el JSON.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — El portal del cliente lista sus reservas**
- GIVEN un cliente con una reserva propia y una importada de la sede de Madrid
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day`, `start` y `site` (`local` o `MAD`)

**Reglas de la capacidad**
- **Dónde viven los datos**: columna `site` en la tabla `bookings` de la base de datos de cada sede
- **Idioma de los nombres**: campo y valores en inglés/código, igual que el resto de `bookingToJson` (`site`, `local`)
- **Límites**: el catálogo de `site` es el mismo que ya usa el prefijo de `code` — `local` (sede propia) o el código de sede en mayúsculas (hoy solo `MAD`)
- **Avisos**: no aplica
- **Regla ante conflicto**: `code` manda sobre `site` — `site` se deriva de su prefijo, nunca es una fuente distinta

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
