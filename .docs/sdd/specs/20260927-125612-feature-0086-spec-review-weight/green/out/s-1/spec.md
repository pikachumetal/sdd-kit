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

1. Columna nueva `site` en `bookings` (migración `db/002-site.sql`, con valor por defecto `local` para las reservas ya existentes).
2. El portal recibe un campo nuevo `site` en `GET /api/bookings`; los campos que ya recibe no cambian.

## Intent

El portal del cliente quiere mostrar en qué sede es cada reserva, y hoy tendría que deducirlo del prefijo del código.

## Scope

- Entra: la columna `site` (`db/002-site.sql`, una línea) y el campo `site` en `bookingToJson` (`src/api.js`, una línea).
- No entra: cambiar el código de reserva; mostrar la sede en recepción.

## Approach

Guardar la sede al crear o importar la reserva y devolverla en el JSON.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — El portal del cliente lista sus reservas**
- GIVEN un cliente con una reserva propia y una importada de la sede de Madrid
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day`, `start` y `site` (`local` o `MAD`)

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
