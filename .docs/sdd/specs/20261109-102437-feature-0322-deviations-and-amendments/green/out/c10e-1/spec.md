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

### Decisiones tomadas con el dev-lead

- `canceladas` separa con ` - `, porque recepción usa una consola `cp850`: `Norte lun - sala ocupada`. — «Con guion normal, que en recepción la raya sale rota.»

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
- AND `cancelar Norte lun --motivo "sala ocupada "` (espacios al principio o al final) responde «cancelada Norte lun (sala ocupada)», y `canceladas` lo enseña sin los espacios
- AND un motivo solo de espacios responde «motivo no válido: cambio de planes, sala ocupada, otro»

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun - sala ocupada»

## Enmiendas

- 2026-11-09 · sin aprobar · THEN de `canceladas`: sustituye «Norte lun — sala ocupada» por «Norte lun - sala ocupada» — aplica la decisión del dev-lead («Con guion normal, que en recepción la raya sale rota»).
- 2026-11-09 · propuesta, sin aprobar · dos AND nuevos en «Cancelar pide un motivo de la lista»: el motivo se acepta sin los espacios de los extremos, y uno solo de espacios no es válido — hallazgo Important de la revisión final («sala ocupada » se rechazaba). Mayúsculas y tabuladores no se tocan: siguen como hoy (fuera de la lista).

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
