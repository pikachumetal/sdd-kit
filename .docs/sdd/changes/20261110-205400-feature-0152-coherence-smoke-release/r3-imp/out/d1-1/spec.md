---
id: 20261014-110000-feature-0024-drop-legacy
feature: 0024
title: Retirar los tests heredados
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

# Spec — Retirar los tests heredados

## Capacidades

- Modificadas: `bookings`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

### Decisiones tomadas con el dev-lead

- `test/legacy.test.js` se borra entero — «ese fichero ya no aporta, fuera»

## Intent

Los tests heredados de la primera versión se leen como si fueran contrato y frenan cada cambio.

## Scope

- Entra: borrar `test/legacy.test.js`.
- No entra: cambiar el comportamiento de `src/app.js`.

## Dónde se prueba

- La retirada: `node --test` en verde sin ese fichero.

## Delta de comportamiento

### Capacidad: `bookings`

**REMOVED — Los tests heredados**
- GIVEN la suite del proyecto
- WHEN se lista `test/`
- THEN `test/legacy.test.js` no existe

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
