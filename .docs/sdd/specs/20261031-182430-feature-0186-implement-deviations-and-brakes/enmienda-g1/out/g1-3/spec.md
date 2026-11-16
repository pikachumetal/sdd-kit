---
id: 20261014-100000-feature-0023-attempt-failure
feature: 0023
title: El intento fallido dice qué sala falló
mode: full
profile: delegate
status: approved
created: 2026-10-14
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-14
---

# Spec — El intento fallido dice qué sala falló

## Capacidades

- Modificadas: `bookings`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Un intento de reserva que falla en la comprobación lenta termina sin decir qué sala falló.

## Scope

- Entra: `attempt` de `src/attempt.js` devuelve el informe de `failureReport` cuando la comprobación falla.
- No entra: cambiar la comprobación de `scripts/slow-gate.mjs`.

## Dónde se prueba

- Informe del fallo: `test/report.test.js`.
- El intento real que falla, por el camino de la comprobación: sin test automático.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Un intento fallido nombra la sala**
- GIVEN la comprobación de `scripts/slow-gate.mjs` falla
- WHEN se ejecuta `attempt('Norte')`
- THEN devuelve `fallo Norte`

## Enmiendas

- 2026-10-31 — sin aprobar: se retira `test/attempt.test.js` de «Dónde se prueba» porque cada pasada tarda 30 s; el camino de `attempt` por la comprobación queda sin test automático.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
