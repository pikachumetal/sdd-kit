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
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué». Enmendada 2026-11-15: la app no tiene usuarios, así que quién cancela lo escribe quien ejecuta, con `--por <nombre>` en `cancelar` (decidido por el dev-lead).
4. `--por` es opcional, para no romper el `cancelar` ya entregado en la Task 1; si falta, la cancelada se lista sin nombre. Decisión mía, a validar.
3. Sin review de spec: dos señales (MODIFIED, datos).

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
- AND `--por <nombre>` no cambia la respuesta y guarda el nombre con la reserva cancelada

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada con `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND una cancelada sin `--por` se lista sin nombre: «Norte lun — sala ocupada»

## Enmiendas

- 2026-11-15 — aprobada por el dev-lead (Task 2): `cancelar` acepta `--por <nombre>` y lo guarda; el listado lo enseña. Toca el `cancelar` de la Task 1, cerrada: va a la Task 3 de enmienda, que se ejecuta antes que la Task 2.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
