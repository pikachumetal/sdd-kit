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
- Nuevas: `bookings` — primera capacidad de reservas, solo con la anulación.
- Modificadas: ninguna (`capabilities/` aún no existe).

## Decisiones que he tomado yo — valida estas

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
2. Quien ejecuta el comando se identifica con `--como NOMBRE`, sin autenticación: es una herramienta de un solo usuario (PRODUCT.md).
3. `bookings` entra como capacidad nueva, no como MODIFIED: no hay capacidad previa. Su delta solo cubre la anulación.
4. Cada reserva guarda quién la pidió (`owner`) para poder distinguir «de otra persona».
5. `anular` sin `--como` se rechaza con «falta --como NOMBRE».

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular SALA DÍA --como NOMBRE`; `data/managers.json`; campo `owner` en las reservas de `src/app.js`.
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

**ADDED — Anular una reserva de otra persona exige ser responsable de la sala**
- GIVEN la reserva de Norte del lunes, con `owner` Pedro
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»

**ADDED — Anular exige decir quién eres**
- GIVEN la reserva de Norte del lunes, con `owner` Pedro
- WHEN `anular Norte lun` sin `--como`
- THEN responde «falta --como NOMBRE» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
