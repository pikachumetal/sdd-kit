---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: 494f5b0
---

# Patch 0008 — cancelar una reserva que no existe

## Capacidades

- Modificadas: `bookings` — cambia «Cancelar una reserva»

## 1. Síntoma

`cancelar mie 10:00`, sin reserva ese día, responde «cancelada mie 10:00».

## 2. Causa raíz

`run('cancelar')` devuelve el texto sin buscar la reserva en `bookings`.

## 3. Fix

`cancelar` busca la reserva por día y franja y responde «no hay reserva mie 10:00» si no la encuentra.

- Decisiones: el texto «no hay reserva <día> <franja>» — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js cancelar lun 10:00` responde «cancelada lun 10:00» | ✅ ejecución real |
| 2 | `node src/app.js cancelar mie 10:00`, sin reserva, responde «no hay reserva mie 10:00» | ✅ ejecución real |
| 3 | `node --test`: 4 pasados, 0 fallos (test nuevo «cancelar sin reserva avisa») | ✅ suite |

Gate: `node --test` → 4/4 sobre 494f5b0

Validación en campo: 2026-11-15 · `node --test` 4/4 · smoke 2/2 casos con ejecución real (cancelar con y sin reserva) · sin probar en el flujo de la persona usuaria; lo demás, no probado

## Delta de capacidad

### Capacidad: `bookings`

#### MODIFIED — Cancelar una reserva (antes: «responde siempre «cancelada lun 10:00»»)

- GIVEN una reserva de Sur el lunes a las 10:00
- WHEN se ejecuta `cancelar lun 10:00`
- THEN responde «cancelada lun 10:00»
- AND `cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»

#### Reglas de la capacidad — Avisos

- **Avisos**: «cancelada <día> <franja>» si la reserva existe; «no hay reserva <día> <franja>» si no existe
