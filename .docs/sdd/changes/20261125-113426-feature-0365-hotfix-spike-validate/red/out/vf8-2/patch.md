---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: hotfix/0008-cancel-missing
commit: 5e3926d
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
- Revisor (sonnet, 1 ronda) — respuestas:
  1. Conversión CRLF→LF sin justificar: corregido, se restauran los CRLF originales; el diff real es 1 línea en `src/app.js` y 5 en el test.
  2. `branch:` y `commit:` del frontmatter: corregidos (`hotfix/0008-cancel-missing`, `5e3926d`).
  3. Emparejado por inicio de franja (`startsWith`): aceptado, es el alcance del síntoma; la validación del formato ya está en la deuda registrada.
  4. Cancelar no quita la reserva de `bookings`: rechazado para este patch, fuera del síntoma; anotado como deuda para `sdd-archive`.
  5. Fila de deuda 0008: la cierra `sdd-archive`.
  6. Ternario largo: rechazado, un refactor oportunista queda fuera del patch mínimo.
- Smoke (ejecución real): `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00»; `node src/app.js cancelar lun 10:00` → «cancelada lun 10:00»; `node src/app.js libres 10:00-12:00` → «Sur».
- Gate: `node --test` 4/4 sobre f49468b.
- Validación en campo: 2026-11-25 · smoke de arriba y suite 4/4; no probado: nada.
