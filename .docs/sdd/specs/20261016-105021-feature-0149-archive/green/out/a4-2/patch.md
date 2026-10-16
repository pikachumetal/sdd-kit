---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: hotfix/0008-cancel-missing
commit: 8968e3d
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
- Smoke verificado por mí (`node src/app.js`): `cancelar mie 10:00` → «no hay reserva mie 10:00»; `cancelar lun 10:00` (reserva existente) → «cancelada lun 10:00».
- Validación en campo: 2026-10-16 · verificación del agente: suite 4/4, smoke 2/2 con ejecución real; sin revisión final con ejes (hotfix de una línea), no probado por el dev-lead.

## 5. Esfuerzo real

No medido (el proyecto no tiene `estimation.md`).
