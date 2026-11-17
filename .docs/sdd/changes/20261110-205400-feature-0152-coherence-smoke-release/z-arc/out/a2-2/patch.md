---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: c1c2436ccfe3d5972f263bef6691c7c505e13937
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

| Smoke | Evidencia |
| --- | --- |
| `cancelar mie 10:00` sin reserva responde «no hay reserva mie 10:00» | ejecución real (`node src/app.js cancelar mie 10:00`) |
| `cancelar lun 10:00` con reserva sigue respondiendo «cancelada lun 10:00» | ejecución real |
| Regresión | suite: `node --test`, 4/4 en `c1c2436` |

Validación en campo: 2026-11-12 · el agente ejecutó el smoke de arriba y `node --test` (4 pasados, 0 fallos) sobre `c1c2436`; nada `no probado`. No hay validación del usuario.
