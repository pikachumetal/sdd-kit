---
id: 20261015-150000-feature-0035-room-hours-cs
feature: 0035
title: Horas reservadas por sala
mode: full
profile: delegate
status: approved
created: 2026-10-15
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-15
---

# Spec — Horas reservadas por sala

## Capacidades

- Modificadas: `bookings` — nace `Rooms.Hours`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

El responsable quiere saber cuántas horas tiene reservada cada sala.

## Scope

- Entra: `Rooms.Hours(string room)` en `Rooms.cs`.
- No entra: cambiar `Program.cs` ni otras funciones de `Rooms`.

## Dónde se prueba

- Horas: por el valor que devuelve `Rooms.Hours(sala)`, en `Tests.cs`, como los demás casos de `Tests.Run`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Las horas de una sala suman sus reservas activas**
- GIVEN las reservas de `Rooms.Bookings`
- WHEN `Rooms.Hours("Norte")`
- THEN devuelve `Norte: 2 h`, por la reserva lun 10:00-12:00
- AND una reserva cancelada no cuenta: `Rooms.Hours("Sur")` devuelve `Sur: 0 h`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-15 | aprobada |
