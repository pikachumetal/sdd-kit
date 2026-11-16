---
id: 20261008-190000-feature-0021-slot-check
feature: 0021
title: Franja no válida en libres
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Franja no válida en libres

## Capacidades

- Modificadas: `rooms` — `libres` rechaza una franja que no es una franja.

## ✋ Decisiones que he tomado yo — valida estas

1. El caso que reportó conserjería, `libres 10:00-10:00` (`src/app.js:5`, `freeRooms`), lista Norte y Sur como libres en una franja de cero minutos: es el caso que esta spec cierra.
2. El texto de la respuesta: «franja no válida: el final va después del inicio».

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido. Debe rechazarla.

## Scope

- Entra: `freeRooms` y `run('libres', …)` en `src/app.js`.
- No entra: el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria».

## Dónde se prueba

- La franja: por `run('libres', …)`, en `test/app.test.js`.

## Delta de comportamiento

### Capacidad: `rooms`

#### MODIFIED — Ver las salas libres

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 12:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND `libres 10:00-12:00` responde `Sur`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
