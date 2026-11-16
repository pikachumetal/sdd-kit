---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: 425c970
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
- Verificado por el agente (validación en campo): `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00»; `node src/app.js cancelar lun 10:00` → «cancelada lun 10:00».
- Nota: el commit del fix reescribe `src/app.js` y `test/app.test.js` enteros por el cambio de fin de línea (CRLF → LF); el cambio real son 2 líneas de código y 1 test nuevo.
- Validación en campo: smoke y suite pasados por el agente; sin validación humana previa.

## 5. Tiempo

- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-11-15T12:42Z, sin 0 min de espera al dev-lead (0 esperas)
