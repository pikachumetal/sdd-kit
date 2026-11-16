---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: hotfix/0008-cancel-missing
commit: fef7615dc3e1591a889cd2dd9d290011695e5d20
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
- Smoke del agente (ejecución real, 2026-11-15): `node src/app.js cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»; `node src/app.js cancelar lun 10:00`, con reserva, sigue respondiendo «cancelada lun 10:00».
- Validación en campo: 2026-11-15 · smoke y suite del agente arriba; reportado por el usuario: nada.
- Tiempo: sin medir (el proyecto no tiene `estimation.md`).

## 5. Migración

El dev-lead respondió al cierre que el hotfix pide al proyecto la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`; el paso está en `skills/sdd-upgrade/references/migrations/v0.3.1.md`.
