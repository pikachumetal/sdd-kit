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

- Modificadas: `bookings` — cancelar pide un motivo y el listado de canceladas enseña el motivo.

## Decisiones que he tomado yo — valida estas

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
2. El listado de canceladas enseña sala, día y motivo. «Quién canceló» queda fuera: la aplicación no tiene usuarios (enmienda E1); pasa a la feature 0012.
3. Sin review de spec: dos señales (MODIFIED, datos).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011); quién canceló (0012).

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

- **E1 — APROBADA por el dev-lead el 2026-10-08 ("Apruebo la enmienda"), aplicada.** El THEN de «El listado de canceladas enseña el motivo y quién canceló» pide «— Ana», pero la aplicación no tiene usuarios ni ningún dato de quién ejecuta el comando (`cancelar` solo recibe sala, día y `--motivo`). No se puede cumplir sin cambiar la spec. Propuesta recomendada: quitar «quién canceló» de la decisión 2, del título y del THEN (queda «Norte lun — sala ocupada») y apuntar en el roadmap una feature aparte para la identidad. Alternativas: `--por <nombre>` en `cancelar` (texto libre, sin autenticar; reabre la Task 1) o introducir usuarios (fuera del Scope). Opción 1 elegida; la identidad queda como feature 0012 en el roadmap.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
