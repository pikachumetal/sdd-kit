---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: 63a4767
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
- El literal viejo «siempre, exista o no la reserva» de la regla **Avisos** se corrige por el delta (regla de la capacidad), no a mano.

## 4. Verificación

- `node --test`: 4 pasados, 0 fallos (test nuevo «cancelar sin reserva avisa»). Verificado por el agente el 2026-10-16 en 63a4767.
- Smoke (agente): `node src/app.js cancelar lun 10:00` → «cancelada lun 10:00»; `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00».
- Validación en campo: 2026-10-16 · smoke del agente sobre el CLI real y suite completa (4/4); el dev-lead no ha probado a mano: no probado por una persona.

## 5. Tiempo

- Esfuerzo real: 0,01 h — reloj de la sesión de cierre desde 2026-10-16T13:47Z, sin esperas (no incluye la sesión que escribió el fix; no medido)
- Tokens del hilo: 254.532 — claude-sonnet-5-5 254.532
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)

## Delta de capacidad

### Capacidad: `bookings`

**MODIFIED — Cancelar una reserva** (antes: «responde siempre «cancelada lun 10:00»»)

- GIVEN una reserva de Sur el lunes a las 10:00
- WHEN se ejecuta `cancelar lun 10:00`
- THEN responde «cancelada lun 10:00»
- AND `cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»

**Reglas de la capacidad**
- **Avisos**: «cancelada <día> <franja>» si existe la reserva; «no hay reserva <día> <franja>» si no existe
