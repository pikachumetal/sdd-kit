---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: hotfix/0008-cancel-missing
commit: 1063f0c
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
- Smoke (verificado por mí, ejecución real, 2026-11-05):
  - `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00» (antes: «cancelada mie 10:00»).
  - `node src/app.js cancelar lun 10:00` → «cancelada lun 10:00» (la reserva existente se sigue cancelando).

Validación en campo: 2026-11-05 · el agente corrió `node --test` (4/4 sobre 1063f0c) y el smoke de arriba; no probado: nada.

## 5. Tiempo

- Esfuerzo real: sin medir (el proyecto no tiene `estimation.md`).

## 6. Migración pendiente para el proyecto

- Respuesta del dev-lead: este hotfix pide añadir la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`. Es un paso a mano del proyecto; el repo no es el del kit, así que no hay `migrations/v0.3.1.md` donde escribirlo.
