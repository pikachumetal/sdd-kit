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

- Nuevas: `bookings` — anular una reserva (solo el responsable de sala), quién anuló y el listado `anuladas`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), reglas de visibilidad o permiso (quién anula y quién ve), datos (guardar quién anuló), contrato público (la salida de `anular` y el comando nuevo `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): qué NO puede hacer el cliente —anular y, si se decide, ver `anuladas`— y si la spec lo dice (señal: permiso)
- Técnica (sonnet): que `anuladas`, hoy inexistente y que cae en `salas`, y el nuevo estado guardado no rompan la salida de `libres` ni de `cancelar` (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. El rol es global, no por sala: el roadmap dice «el responsable de cada sala», pero sin usuarios no hay quién sea responsable de cuál. Pendiente de que lo valides.
3. Capacidad nueva `bookings` (slug en inglés, kebab-case): no existe ninguna en `capabilities/`, así que el delta es `ADDED`, no `MODIFIED`.
4. `anuladas` es un comando nuevo: hoy no existe y `run('anuladas', …)` cae en `salas`. El nombre lo he puesto yo.
5. Literales míos: `solo el responsable de sala puede anular`, `Norte lun — anulada por responsable` y `sin anuladas`.
6. Sin `--como`, `anular` se niega con el mismo texto que para el cliente: lo más restrictivo.
7. Pendiente: si el cliente puede usar `anuladas`. Supuesto mientras no lo decidas: sí, sin restricción.
- Pasada de coherencia: el delta probado en una copia con `sdd capability merge` da `bookings.md: añadido «Anular una reserva»` y `bookings.md: añadido «Listar las anuladas»`. La primera versión, con `MODIFIED` sobre una capacidad que no existe, la rechazaba; corregida a `ADDED` con `bookings` en «Nuevas».

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como`, guardar quién anuló, y el comando nuevo `anuladas` que lo lista (`src/app.js`).
- No entra: `cancelar`.

## Dónde se prueba

- Anular y `anuladas`: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js` (fichero nuevo), como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND sin `--como` responde `solo el responsable de sala puede anular` y la reserva sigue activa

**ADDED — Listar las anuladas**
- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `anuladas`
- THEN responde `Norte lun — anulada por responsable`
- AND sin ninguna anulada responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
