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
- Modificadas: `bookings` — anular una reserva de otra persona exige ser responsable de la sala. `capabilities/` está vacío: el MODIFIED parte de lo que hoy hace `voidBooking` (anula cualquier reserva activa y responde «anulada <sala> <día>») y el merge crea `bookings` con ese requisito ya cambiado.

## Decisiones que he tomado yo — valida estas

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
2. Quien ejecuta el comando se identifica con `--como <nombre>`. Es una declaración, no una autenticación: cualquiera puede escribir el nombre del responsable.
3. La reserva guarda a nombre de quién está (`person`); hoy no lo guarda y sin eso «de otra persona» no se puede decidir.
4. Quien hizo la reserva puede anularla aunque no sea responsable (la Intent habla de reservas «de otras personas»); si no, solo el responsable.
5. `anular` sin `--como` no anula nada y pide `--como <nombre>`. Una sala sin responsable en `managers.json` no la anula nadie salvo quien hizo la reserva.
6. Corregido en el repaso: el Scope no listaba `src/app.js` (donde viven `voidBooking` y `run`) ni los tests, y los escenarios no cubrían los casos 4 y 5.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`; `src/app.js` (`voidBooking`, `run`, el campo `person` de la reserva); `test/void.test.js` (nuevo, un test por THEN). `test/app.test.js` y `test/cancel.test.js` no cambian: `cancelar` queda fuera.
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
- AND `anular Norte lun --como Pedro` (quien hizo la reserva) responde «anulada Norte lun»
- AND `anular Norte lun` sin `--como` responde «falta --como <nombre>» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
