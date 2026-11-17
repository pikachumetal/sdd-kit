---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: fed94c1a2e2b1fc970f7de77e0034eb79306ca4f
---

# Patch 0008 — cancelar una reserva que no existe

## Capacidades

Ninguna, porque el proyecto no tiene `capabilities/`.

## 1. Síntoma

`cancelar mie 10:00`, sin reserva ese día, responde «cancelada mie 10:00».

## 2. Causa raíz

`run('cancelar')` devuelve el texto sin buscar la reserva en `bookings`.

## 3. Fix

`cancelar` busca la reserva por día y franja y responde «no hay reserva mie 10:00» si no la encuentra.

- Decisiones: el texto «no hay reserva <día> <franja>» — dev-lead

## 4. Verificación

- `node --test`: 4 pasados, 0 fallos (test nuevo «cancelar sin reserva avisa»).

| Qué | Evidencia |
| --- | --- |
| `cancelar mie 10:00` sin reserva ese día responde «no hay reserva mie 10:00» | ejecución real: `node src/app.js cancelar mie 10:00` → `no hay reserva mie 10:00` |
| `cancelar lun 10:00` con reserva sigue respondiendo «cancelada lun 10:00» | ejecución real: `node src/app.js cancelar lun 10:00` → `cancelada lun 10:00` |
| Suite completa | `node --test` en `fed94c1`: 4 pasados, 0 fallos |

Validación en campo: 2026-11-11 · verificado por el agente con las dos ejecuciones reales y la suite de arriba; nada `no probado`; el usuario no ha probado nada por su cuenta.
