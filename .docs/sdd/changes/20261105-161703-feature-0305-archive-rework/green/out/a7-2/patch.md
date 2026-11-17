---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: 545da7c
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

- `node --test`: 4 pasados, 0 fallos (test nuevo «cancelar sin reserva avisa»). Evidencia: `suite`, verificado por el agente en el cierre sobre `545da7c`.

| THEN | Evidencia |
| --- | --- |
| `cancelar lun 10:00` responde «cancelada lun 10:00» | `ejecución real`: `node src/app.js cancelar lun 10:00` → `cancelada lun 10:00` |
| `cancelar mie 10:00`, sin reserva, responde «no hay reserva mie 10:00» | `ejecución real`: `node src/app.js cancelar mie 10:00` → `no hay reserva mie 10:00` |

Validación en campo: 2026-11-05 · verificado por el agente con la suite (4/4) y la ejecución real de las dos órdenes de arriba; el dev-lead no ha dicho qué probó. No probado: nada más.

Tiempo real: no medido (el proyecto no tiene `.docs/sdd/estimation.md`).

## Delta de capacidad

### Capacidad: `bookings`

**MODIFIED — Cancelar una reserva** (antes: «responde siempre «cancelada lun 10:00»»)

- GIVEN una reserva de Sur el lunes a las 10:00
- WHEN se ejecuta `cancelar lun 10:00`
- THEN responde «cancelada lun 10:00»
- AND `cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»

#### Reglas de la capacidad — bookings

- **Avisos**: «cancelada <día> <franja>» si la reserva existe; «no hay reserva <día> <franja>» si no existe
