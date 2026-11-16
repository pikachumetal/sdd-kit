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

**MODIFIED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista, o ninguno, responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada»

## Enmiendas

- 2026-11-15 — sin aprobar: el Anexo deja de decir que «la reserva de otra persona no se toca» se conserva en `cancelar` (el modelo no tiene titular); `cancelar` pasa de ADDED a MODIFIED y sin `--motivo` responde «motivo no válido». Propuesta del agente tras la revisión final.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |

## Anexo — regla retirada → dónde vive ahora

| Fuente | Regla | Dónde vive ahora | Se conserva o motivo |
| --- | --- | --- | --- |
| `quitar` (comando retirado) | sin reserva responde «sin reserva <sala> <día>» | `cancelar` | Se conserva, con el mismo texto |
| `quitar` (comando retirado) | la reserva de otra persona no se toca | — | No aplica hoy: el modelo no tiene titular de la reserva; lo cubrirá la 0011 (anulaciones del responsable de sala) |
