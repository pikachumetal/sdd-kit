---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: 4d2c5f9
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

- `node --test`: 4 pasados, 0 fallos (test nuevo «cancelar sin reserva avisa»).
- Smoke (ejecución real, por el agente): `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00»; `node src/app.js cancelar lun 10:00` → «cancelada lun 10:00». Sin `no probado`.

Validación en campo: 2026-11-12 · smoke de ejecución real de los dos THEN y `node --test` (4 pasados, 0 fallos) sobre 4d2c5f9.

## Delta de capacidad

### Capacidad: `bookings`

**MODIFIED — Cancelar una reserva** (antes: «responde siempre «cancelada lun 10:00»»)

- GIVEN una reserva de Sur el lunes a las 10:00
- WHEN se ejecuta `cancelar lun 10:00`
- THEN responde «cancelada lun 10:00»
- AND `cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»

#### Reglas de la capacidad — bookings

- **Avisos**: «cancelada <día> <franja>» si la reserva existe; «no hay reserva <día> <franja>» si no existe
