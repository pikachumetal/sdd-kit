---
id: 20261017-221212-patch-0012-reservas-sala
task: 0012
title: Patch — comando reservas por sala y libres sin franja
type: patch
solution: dev-lead
status: done
created: 2026-10-18
branch: feature/0012-reservas-sala
commit: pendiente
---

# Patch 0012 — comando reservas por sala y libres sin franja

## Capacidades

- Ninguna, porque ninguna capacidad describe `reservas` ni `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición del dev-lead: «un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, con el formato `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`; y `libres` sin franja responde `indica una franja`».

## 2. Solución fijada

Frase literal del dev-lead (autor: dev-lead) en el punto anterior. Lo que da por existente, comprobado en `src/app.js`: `bookings` con `room`, `day`, `slot` y `status`, y el comando `libres`. Hoy `libres` sin franja devolvía todas las salas (`freeRooms(undefined)` no filtra nada).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `run` atiende `reservas <sala>` con `roomBookings` (líneas `<día> <franja>` de las reservas `active`, o `sin reservas <sala>`), y `libres` sin franja responde `indica una franja`.
- **Decisiones**:
  - Formato, mensaje vacío y mensaje de `libres` — dev-lead
  - Orden de las líneas: el de creación de las reservas — sin el dev-lead (a validar: visible si una sala tiene varias reservas)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `reservas Norte` → `lun 10:00-12:00` | ✅ test en RED antes, verde después |
| 2 | `reservas Sur` → `sin reservas Sur` | ✅ |
| 3 | `libres` sin franja → `indica una franja` | ✅ |
| 4 | Gate: `node --test && node scripts/lint.mjs` | ✅ 7/7 y lint sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-10-17T22:12Z
- Esfuerzo real: aproximado con las marcas de los commits, al cerrar
- Coste de sujetos: no aplica
