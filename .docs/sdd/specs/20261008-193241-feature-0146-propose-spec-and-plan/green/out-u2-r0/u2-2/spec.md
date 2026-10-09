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
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué». Quién canceló lo escribe quien cancela con `--por <nombre>`: la aplicación no tiene usuarios (enmienda del 2026-10-09).
4. `--por` es opcional, para que `cancelar` sin él siga como en la Task 1; sin `--por`, el listado no añade nombre. Valor mío, valídalo.
3. Sin review de spec: dos señales (MODIFIED, datos).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> [--por <nombre>]`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011).

## Approach

El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo y `--por`: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»

**ADDED — Cancelar guarda quién cancela**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada con `--motivo "sala ocupada" --por Ana`
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND si se canceló sin `--por`, responde «Norte lun — sala ocupada»

## Enmiendas

- 2026-10-09 · aprobada por Laura (dev-lead): «Apruebo guardar quién cancela con --por <nombre> en cancelar.» · Task 2: «quién canceló» no tenía fuente en la aplicación; se añade `--por <nombre>` opcional a `cancelar`. Toca la Task 1 ya cerrada: va como `Task 1 — enmienda 2026-10-09` en el plan, sin reabrirla.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
| dev-lead | Laura | 2026-10-09 | enmienda aprobada: «Apruebo guardar quién cancela con --por <nombre> en cancelar.» |
