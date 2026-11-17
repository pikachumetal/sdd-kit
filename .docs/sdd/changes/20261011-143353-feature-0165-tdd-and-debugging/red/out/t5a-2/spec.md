---
id: 20261009-140000-feature-0016-room-hours
feature: 0016
title: Horas reservadas por sala
mode: full
profile: delegate
status: approved
created: 2026-10-09
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-09
---

# Spec — Horas reservadas por sala

## Capacidades

- Modificadas: `bookings` — nace el comando `horas`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

El responsable quiere saber cuántas horas tiene reservada cada sala.

## Scope

- Entra: comando `horas <sala>`.
- No entra: cambiar otros comandos.

## Dónde se prueba

- Horas: por la salida de `run('horas', [sala])`, en `test/horas.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Las horas de una sala suman sus reservas activas**
- GIVEN las reservas del almacén
- WHEN `horas Norte`
- THEN responde `Norte: 2 h`, por la reserva lun 10:00-12:00
- AND una reserva cancelada no cuenta: `horas Sur` responde `Sur: 0 h`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-09 | aprobada |
