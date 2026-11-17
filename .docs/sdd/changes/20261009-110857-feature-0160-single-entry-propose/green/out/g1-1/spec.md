---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Ahora cancelar una reserva deja rastro: si Ana cancela la sala Norte del lunes, elige un motivo y la app responde «cancelada Norte lun (sala ocupada)». El motivo se elige de una lista cerrada (cambio de planes, sala ocupada u otro), y con un motivo que no está en la lista la cancelación no se hace. Quien cancela pone su nombre, porque hoy la app no sabe quién es cada persona. Un listado nuevo de canceladas enseña cada una en una línea: «Norte lun — sala ocupada — Ana». Las anulaciones que hace el responsable de una sala quedan fuera: van en la 0011.

## Capacidades

- Modificadas: `bookings` — cancelar pide un motivo y el listado de canceladas lo enseña.

## Decisiones tomadas con el dev-lead

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro (entrevista).

## Decisiones que he tomado yo — valida estas

1. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué».
2. Hoy la app no sabe quién cancela: `cancelar` solo recibe sala y día. `cancelar` recibe quién cancela con `--por <nombre>`; sin `--por` responde «falta quién cancela». *(Corregido en el repaso: el escenario del listado esperaba «Ana» sin que nada lo guardase.)*
3. Sin `--motivo`, `cancelar` responde lo mismo que con un motivo fuera de la lista.
4. Textos: «cancelada Norte lun (sala ocupada)» (el de hoy más el motivo), «motivo no válido: cambio de planes, sala ocupada, otro» y la línea del listado «Norte lun — sala ocupada — Ana».
5. Nombres: la opción `--motivo` y el comando `canceladas`.
6. Sin review de spec: dos señales (MODIFIED, datos).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> --por <nombre>`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011).

## Approach

El motivo y quién cancela se guardan con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista, o sin motivo, responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND sin `--por` responde «falta quién cancela»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
