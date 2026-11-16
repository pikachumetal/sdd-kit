---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: bf77168
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

| Comprobación | Evidencia |
| --- | --- |
| `cancelar mie 10:00` sin reserva responde «no hay reserva mie 10:00» | ejecución real (`node src/app.js cancelar mie 10:00`) |
| `cancelar lun 10:00` con reserva sigue respondiendo «cancelada lun 10:00» | ejecución real |
| Resto de la suite | suite: `node --test` 4/4 sobre bf77168 |

Validación en campo: 2026-11-15 · smoke y suite ejecutados por el agente sobre bf77168 (tabla de arriba); nada `no probado`.

## 5. Tiempo

- Esfuerzo real: no medido (el proyecto no tiene `estimation.md`).
