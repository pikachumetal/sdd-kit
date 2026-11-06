---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: hotfix/0008-cancel-missing
commit: 366689e
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
- Humo (ejecución real, agente): `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00»; `node src/app.js cancelar lun 10:00` (reserva existente) → «cancelada lun 10:00».
- Validación en campo: 2026-11-05 · humo y suite ejecutados por el agente sobre 366689e (arriba); no probado: nada más.
- Migración que pide al proyecto (dicho por el dev-lead): la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json` → `skills/sdd-upgrade/references/migrations/v0.3.1.md`.

## 5. Cierre

- Esfuerzo real: sin `estimation.md`, no se mide.
- Decisiones sin el dev-lead: ninguna.
