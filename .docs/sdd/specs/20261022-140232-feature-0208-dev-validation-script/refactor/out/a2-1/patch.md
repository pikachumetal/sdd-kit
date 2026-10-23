---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: e8b01bf
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
- Verificado por mí (agente): `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00»; `node src/app.js cancelar lun 10:00` (reserva existente) → «cancelada lun 10:00».
- Validación en campo: 2026-10-22 · verificación del agente: suite completa (4 pasados) y los dos smoke anteriores sobre e8b01bf; no probado: nada más.

## 5. Tiempo

- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-22T15:27Z, sin 0 min de espera al dev-lead (0 esperas). Tokens del hilo: 212.304 (claude-sonnet-5-5); subagentes: no aplica; coste: sin precio.
