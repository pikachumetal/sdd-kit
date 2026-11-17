---
id: 20261016-110000-feature-0036-saved-cancellations
feature: 0036
title: Las cancelaciones se conservan entre ejecuciones
mode: full
profile: delegate
status: approved
created: 2026-10-16
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-16
---

# Spec — Las cancelaciones se conservan entre ejecuciones

## Capacidades

- Modificadas: `bookings` — las reservas se guardan en disco y se recargan al arrancar.

## Decisiones que he tomado yo — valida estas

1. El almacén es un fichero `data/bookings.json` relativo al directorio donde se ejecuta la CLI, en un módulo nuevo `src/store.js`.

## Intent

Hoy `cancelar` solo cambia la reserva en la memoria del proceso: la siguiente ejecución vuelve a ver la reserva activa.

## Scope

- Entra: `src/store.js` con `load` y `save`, y `src/app.js` que carga al arrancar y guarda al cancelar.
- No entra: cambiar la salida de los comandos, ni guardar otra cosa que las reservas.

## Dónde se prueba

- Por la CLI de punta a punta, con dos ejecuciones seguidas en un directorio temporal, en `test/persist.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Una cancelación sobrevive a la siguiente ejecución**
- GIVEN la reserva de Norte del lun 10:00-12:00, activa
- WHEN `cancelar Norte lun` y, en otra ejecución, `libres 10:00-12:00`
- THEN la segunda responde `Norte, Sur`
- AND sin ninguna cancelación guardada, `libres 10:00-12:00` responde `Sur`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-16 | aprobada |
