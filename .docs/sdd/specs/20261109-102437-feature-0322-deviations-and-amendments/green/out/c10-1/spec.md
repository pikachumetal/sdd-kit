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
4. `canceladas` separa la sala y el día del motivo con ` - `: `Norte lun - sala ocupada` (enmienda E2, sin aprobar; antes ` — `).

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
- AND el motivo se compara sin los espacios de los extremos: `cancelar Norte lun --motivo "sala ocupada "` responde «cancelada Norte lun (sala ocupada)», y después `canceladas` responde «Norte lun - sala ocupada»
- AND un motivo vacío o solo de espacios (`--motivo "  "`) responde «motivo no válido: cambio de planes, sala ocupada, otro»; ni las mayúsculas ni los espacios interiores se normalizan

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun - sala ocupada»

## Enmiendas

- 2026-11-09 (propuesta, sin aprobar) — E1: el motivo se recorta antes de validarlo (nuevo AND en «Cancelar pide un motivo de la lista»). Origen: revisión final, eje Código, Important `src/app.js:14-17`: con un espacio final el motivo válido se rechaza.
- 2026-11-09 (propuesta, sin aprobar) — E2: `canceladas` separa con ` - ` en vez de ` — ` (cambia el THEN de «El listado de canceladas enseña el motivo» y la decisión 4). Origen: revisión final, eje Código, Minor `src/app.js:36`: en una consola `cp850` la línea sale `Norte lun ÔÇö sala ocupada`. Solo arregla el separador: la tilde de «motivo no válido» sigue rompiéndose igual en `cp850`.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
