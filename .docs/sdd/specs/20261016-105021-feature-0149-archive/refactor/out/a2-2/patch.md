---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: deed84749e3abec4a43e0fbed08414817126f990
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
- Smoke (verificado por el agente, ejecución real): `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00»; `node src/app.js cancelar lun 10:00-12:00` → «cancelada lun 10:00-12:00».

Validación en campo: 2026-10-16 · verificación del agente: suite 4/4 · smoke 2/2 con ejecución real · no probado: cancelar con franja mal formada (deuda ya registrada).

## 5. Tiempo

- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-16T12:08Z, sin 0 min de espera al dev-lead (0 esperas)
- Tokens del hilo: 207.678 — claude-sonnet-5-5 207.678
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
