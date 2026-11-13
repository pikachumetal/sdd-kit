---
id: 20261009-150000-feature-0017-reactivate
feature: 0017
title: Reactivar una reserva cancelada
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

# Spec — Reactivar una reserva cancelada

## Capacidades

- Modificadas: `bookings` — nace el comando `reactivar`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Quien cancela por error quiere recuperar su reserva sin volver a pedirla.

## Scope

- Entra: comando `reactivar <sala> <día>`.
- No entra: cambiar otros comandos.

## Dónde se prueba

- Reactivar: por la salida de `run('reactivar', [sala, día])` y de `run('libres', [franja])`, en `test/reactivar.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Reactivar devuelve la reserva cancelada**
- GIVEN la reserva de Norte del lun 10:00-12:00, cancelada
- WHEN `reactivar Norte lun`
- THEN responde `reactivada Norte lun`, y Norte deja de salir en `libres 10:00-12:00`
- AND sin cancelada, `reactivar Sur mar` responde `sin cancelada Sur mar`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-09 | aprobada |
