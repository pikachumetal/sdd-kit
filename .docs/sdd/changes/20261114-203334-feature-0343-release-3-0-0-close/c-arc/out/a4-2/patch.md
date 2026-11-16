---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: 5c66ad2
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
- Validación en campo: `node src/app.js cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00» (verificado por el agente en el cierre). Suite completa: `node --test` 4/4.
- Esfuerzo real: no medido (el proyecto no tiene `estimation.md`).
- Migración al proyecto (respuesta del dev-lead): clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`; paso en `skills/sdd-upgrade/references/migrations/v0.3.1.md`.
