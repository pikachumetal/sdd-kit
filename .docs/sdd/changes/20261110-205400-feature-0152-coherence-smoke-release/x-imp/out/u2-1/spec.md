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
2. El listado de canceladas enseña sala, día, motivo y quién canceló, que se guarda con `cancelar … --por <nombre>` — decidido por Laura el 2026-11-12 (antes de la enmienda se proponía quitar «quién»).
3. `--por` es opcional: sin él `cancelar` responde como hoy y la reserva queda sin quién; `canceladas` no pone nada tras el motivo. — **sin aprobar**: Laura no dijo si es obligatorio ni qué enseña el listado sin él.
4. Sin review de spec: dos señales (MODIFIED, datos).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> [--por <nombre>]`; comando `canceladas`.
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

**ADDED — Cancelar guarda quién cancela**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)» y guarda «Ana» con la reserva

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND una cancelada sin `--por` responde «Norte lun — sala ocupada» (sin aprobar)

## Enmiendas

- 2026-11-12 · aprobada por Laura en lo esencial (quién se guarda con `--por <nombre>`; revierte la corrección anterior de quitar «quién») · `--por` opcional y el listado sin `--por` van **sin aprobar** · cambia una task cerrada: Task 3 la completa.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
