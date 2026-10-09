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
3. `anular` exige ser responsable de la sala **siempre**, también sobre la reserva propia (en `PRODUCT.md`, anular es del responsable; quien reservó usa `cancelar`). Alternativa: dejar al titular anular la suya.
4. Sin `--como`, o en una sala sin responsable en `managers.json`, `anular` rechaza y la reserva sigue activa (falla cerrado).
5. Las reservas pasan a tener titular (`owner`): hoy `src/app.js` no lo guarda y sin él «reserva de Pedro» no existe. La reserva de ejemplo (Norte lun) queda a nombre de Pedro.
6. `bookings` no existe aún en `capabilities/` (no hay carpeta): este delta la crea con el comportamiento actual de `anular` más el cambio, no hay requisito previo que fusionar.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`; `src/app.js` (`voidBooking`, el despacho de `anular` en `run`, el `owner` de las reservas); `test/anular.test.js` (nuevo); `capabilities/room-managers.md` y `capabilities/bookings.md` al cierre.
- No entra: `cancelar`, que sigue igual (`cancelBooking`, `test/cancel.test.js`); `reservar`.

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

**MODIFIED — Anular exige identificarse y una sala con responsable**
- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Pedro`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- GIVEN la misma reserva
- WHEN `anular Norte lun` (sin `--como`)
- THEN responde «falta --como <nombre>» y la reserva sigue activa
- GIVEN una sala que no está en `managers.json`
- WHEN `anular <sala> lun --como Ana`
- THEN responde «la sala <sala> no tiene responsable» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
