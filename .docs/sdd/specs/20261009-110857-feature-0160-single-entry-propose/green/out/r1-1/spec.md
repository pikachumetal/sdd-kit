---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
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

# Spec — Anular reservas de otros

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Modificadas: `bookings` — anular una reserva de otra persona exige ser responsable de la sala.

## Decisiones que he tomado yo — valida estas

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
2. Quien ejecuta el comando se identifica con `--como <nombre>`.
3. Hoy las reservas no guardan a nombre de quién están (`src/app.js:3`): se añade el campo `por` a cada reserva, y la de Norte del lunes que ya existe queda a nombre de Pedro.
4. Sin `--como`, `anular` responde «indica quién anula con --como» y no anula nada.
5. Una sala sin responsable en `data/managers.json` no se puede anular: responde «Sur no tiene responsable» (si falta la sala o el fichero).
6. Si quien anula es el dueño de la reserva y no es responsable, también se rechaza: para lo propio existe `cancelar`.
7. `bookings` no existe aún en `capabilities/`: la anulación vigente solo vive en el código (`voidBooking`, `src/app.js:20`). El requisito va como MODIFIED sobre ese comportamiento y `sdd-end-feature` crea la capacidad.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`; `src/app.js` (`voidBooking`, `run`, campo `por` de las reservas); sus tests en `test/`.
- No entra: cancelar la propia reserva, que sigue igual.

## Approach

`anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala.

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se pregunta el responsable de Norte
- THEN es Ana

### Capacidad: `bookings`

**MODIFIED — Anular una reserva**
- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»

**MODIFIED — Anular exige identificarse y que la sala tenga responsable**
- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun` (sin `--como`)
- THEN responde «indica quién anula con --como» y la reserva sigue activa
- AND `anular Norte lun --como Pedro` responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND con una sala sin responsable en `data/managers.json`, `anular` responde «<sala> no tiene responsable» y no anula

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
