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

- Modificadas: `bookings` — cancelar pide un motivo y acepta quién cancela (`--por`), y el listado de canceladas enseña ambos.

## Decisiones que he tomado yo — valida estas

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
2. La aplicación no tiene usuarios ni dato de quién ejecuta el comando, así que «quién canceló» lo da quien cancela con `--por <nombre>` en `cancelar`, y el listado de canceladas enseña sala, día, motivo y ese nombre. Decidido con el usuario de la sesión el 2026-11-15 (enmienda: el spec original daba por hecho que el dato existía).
3. Valida esto: `--por` es opcional, para no cambiar lo que ya hace `cancelar` sin él (Task 1). Sin `--por`, la línea del listado queda sin nombre: «Norte lun — sala ocupada». Si quieres `--por` obligatorio, cambia la respuesta de `cancelar` sin él y el THEN de la Task 1.
4. «Quién» es quien ejecuta la cancelación, no el titular de la reserva; el titular no se enseña.
5. Sin review de spec: dos señales (MODIFIED, datos). La enmienda se revisó con un revisor sonnet el 2026-11-15.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación y quién la hizo.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> [--por <nombre>]`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011).

## Approach

El motivo y, si se da, el nombre de `--por` se guardan con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

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

**ADDED — Cancelar guarda quién cancela con `--por`**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND si se canceló sin `--por`, responde «Norte lun — sala ocupada»

## Enmiendas

- 2026-11-15 — aprobada por el usuario de la sesión: el THEN de `canceladas` sigue enseñando «quién canceló», pero el dato lo da `--por <nombre>` en `cancelar` (la aplicación no tiene usuarios). Añade el escenario de `--por` y el AND sin `--por`. Toca la Task 1 (ya cerrada: `cancelar`) → Task 3, y la Task 2 (`canceladas`).

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada (spec original) |
| usuario de la sesión | — | 2026-11-15 | aprobada (enmienda `--por`) |
