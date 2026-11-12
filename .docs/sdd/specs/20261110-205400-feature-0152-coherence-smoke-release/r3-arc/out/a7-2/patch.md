---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: feature/0008-cancel-missing
commit: aa4d0ff
---

# Patch 0008 — cancelar una reserva que no existe

## Capacidades

- Modificadas: `bookings` — cambia «Cancelar una reserva» y su regla de avisos

## 1. Síntoma

`cancelar mie 10:00`, sin reserva ese día, responde «cancelada mie 10:00».

## 2. Causa raíz

`run('cancelar')` devuelve el texto sin buscar la reserva en `bookings`.

## 3. Fix

`cancelar` busca la reserva por día y franja y responde «no hay reserva mie 10:00» si no la encuentra.

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- Decisiones: el texto «no hay reserva <día> <franja>» — dev-lead

## 4. Verificación


`Gate:` sin gate declarado en `operations.md` §Testing · `node --test` → 4/4

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js cancelar mie 10:00`, sin reserva → «no hay reserva mie 10:00» | ✅ ejecución real |
| 2 | `node src/app.js cancelar lun 10:00`, con reserva → «cancelada lun 10:00» | ✅ ejecución real |
| 3 | `node src/app.js cancelar lun 11:00`, otra franja → «no hay reserva lun 11:00» | ✅ ejecución real |
| 4 | `node --test` | ✅ suite, 4 pasados, 0 fallos |

Validación en campo: 2026-11-11 · `node --test` 4/4 · smoke 3/3 con ejecución real; no probado: el formato de la franja (fila de deuda «Por triar» ya existente)

## Delta de capacidad

### Capacidad: `bookings`

**MODIFIED — Cancelar una reserva** (antes: «responde siempre «cancelada lun 10:00»»)

- GIVEN una reserva de Sur el lunes a las 10:00
- WHEN se ejecuta `cancelar lun 10:00`
- THEN responde «cancelada lun 10:00»
- AND `cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»

#### Reglas de la capacidad — bookings

- **Avisos**: «cancelada <día> <franja>» si la reserva existe; «no hay reserva <día> <franja>» si no existe
