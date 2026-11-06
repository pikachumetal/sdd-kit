---
id: 20261008-170000-feature-0019-free-without-slot
feature: 0019
title: libres sin franja dice qué falta
mode: lite
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — libres sin franja dice qué falta

## Capacidades

- Nuevas: `rooms` — `libres` sin franja dice qué falta en vez de listar todas las salas.

## ✋ Decisiones que he tomado yo — valida estas

1. El mensaje es `falta la franja: libres <franja>`, con la forma de la guía.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora: quien lo escribe sin franja reserva una sala ocupada.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: `libres <franja>`, que responde igual que hoy.

## Dónde se prueba

- El mensaje: por `run('libres', [])`, en `test/app.test.js`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`, con Norte reservada el lunes de 10:00 a 12:00
- WHEN `libres` sin franja
- THEN responde `falta la franja: libres <franja>`
- AND `libres 10:00-12:00` responde `Sur`

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una rama en `run` y su test
- Confianza: alta

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
