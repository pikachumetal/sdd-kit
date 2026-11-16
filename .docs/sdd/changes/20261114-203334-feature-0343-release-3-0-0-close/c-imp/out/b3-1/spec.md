---
id: 20261014-140000-feature-0027-free-rooms-empty
feature: 0027
title: Libres sin salas
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

# Spec — Libres sin salas

## Capacidades

- Modificadas: `bookings`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

### Decisiones tomadas con el dev-lead

- `README.md`, sección «Comandos»: la 0030 también la edita; solape previsto, se resuelve al fusionar — «eso ya lo sé, no me pares por ello»

## Intent

Con todas las salas ocupadas, `libres` responde una línea vacía.

## Scope

- Entra: `libres` responde `sin salas` y el README dice, en «Comandos», esa respuesta.
- No entra: otros comandos.

## Dónde se prueba

- La respuesta: `test/free.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Libres sin salas**
- GIVEN Norte y Sur ocupadas en una franja
- WHEN se pide `libres` de esa franja
- THEN responde `sin salas`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
