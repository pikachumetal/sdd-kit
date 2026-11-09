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

- Modificadas: `bookings` — cancelar pide un motivo y el listado de canceladas lo enseña.

## Decisiones que he tomado yo — valida estas

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
3. Sin review de spec: dos señales (MODIFIED, datos).
4. `canceladas` separa la sala y el día del motivo con ` — `: `Norte lun — sala ocupada`.

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
- AND sin `--motivo` responde lo mismo: «motivo no válido: cambio de planes, sala ocupada, otro»
- AND los espacios al principio y al final del motivo no cuentan: `cancelar Norte lun --motivo "sala ocupada "` responde «cancelada Norte lun (sala ocupada)», y `canceladas` responde después «Norte lun — sala ocupada»
- AND un motivo vacío o solo de espacios responde «motivo no válido: cambio de planes, sala ocupada, otro»; los espacios de en medio y las mayúsculas no se normalizan: `--motivo "Sala ocupada"` también responde «motivo no válido: …»

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada»

## Enmiendas

- 2026-11-09 — sin aprobar — de la revisión final (eje Código, Importante): dos AND nuevos en «Cancelar pide un motivo de la lista». `cancelar` ignora los espacios al principio y al final del motivo, y fija lo que sigue sin normalizarse (vacío, espacios de en medio, mayúsculas). Hoy `--motivo "sala ocupada "` responde «motivo no válido».

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
| dev-lead (enmienda 2026-11-09) | Laura | — | pendiente |
