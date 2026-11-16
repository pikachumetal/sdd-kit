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
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué».
3. Sin review de spec: dos señales (MODIFIED, datos).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> [--por <nombre>]`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011).

## Approach

El motivo y quien cancela (`--por`) se guardan con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

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
- AND `--por` es opcional y no cambia la respuesta: `cancelar Norte lun --motivo "sala ocupada" --por Ana` responde «cancelada Norte lun (sala ocupada)»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada con `--motivo "sala ocupada" --por Ana`
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND si se canceló sin `--por`, responde «Norte lun — sala ocupada — sin indicar»

## Enmiendas

- 2026-10-10 · aprobada por el usuario en la sesión · El THEN del listado pedía «— Ana» y la aplicación no tiene usuarios ni dato de quién ejecuta el comando. Se añade `--por <nombre>` a `cancelar` (Scope, Approach y Delta). Es el nombre que se escribe, sin verificar. Decisión mía dentro de la enmienda, a validar: `--por` es opcional (para no romper el primer escenario, que no lo lleva) y, sin él, el listado dice «sin indicar». Toca `cancelar`, ya cerrado en la Task 1: va a la Task 3.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
