---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: approved
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-08
---

# Spec — Motivo al cancelar

## Capacidades

- Nuevas: `bookings` — cancelar pide un motivo y el listado de canceladas lo enseña.

## Decisiones que he tomado yo — valida estas

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
3. Sin review de spec: dos señales (MODIFIED, datos).
4. `bookings` es capacidad nueva (cierre): el proyecto no tenía `capabilities/bookings.md`, así que el delta se declara en «Nuevas» y no en «Modificadas».

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011).

## Approach

El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada»

## Enmiendas

- 2026-10-30 (cierre, sin aprobar por el dev-lead): «Capacidades» pasa de «Modificadas» a «Nuevas» porque `capability merge` no encuentra `bookings` en `capabilities/`; el delta (dos ADDED) no cambia.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
