---
id: 20261017-220956-patch-0012-reservas
task: 0012
title: Patch — comando reservas y aviso en libres sin franja
type: patch
solution: dev-lead
status: done
created: 2026-10-17
branch: feature/0012-reservas
commit: pendiente
---

# Patch 0012 — comando reservas y aviso en libres sin franja

## Capacidades

- Ninguna, porque ninguna capacidad describe `reservas` ni `libres` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Petición del dev-lead: un comando `reservas <sala>` que liste las reservas activas de la sala, y que `libres` sin franja avise en vez de listar todas las salas.

## 2. Solución fijada

Del dev-lead, literal: «un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, con el formato `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`; y `libres` sin franja responde `indica una franja`».

Lo que da por existente, comprobado: `run` en `src/app.js` despacha por comando y las reservas tienen `room`, `day`, `slot` y `status`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `roomBookings(room)` y la rama `reservas` en `run`; `libres` responde `indica una franja` si no recibe franja.
- **Decisiones**:
  - Varias reservas se separan con salto de línea, una por línea — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `reservas Norte` → `lun 10:00-12:00` (RED antes del cambio, ahora OK) | ✅ |
| 2 | `reservas Sur` → `sin reservas Sur` | ✅ |
| 3 | `libres` sin franja → `indica una franja` | ✅ |
| 4 | Gate de cierre `node --test` | ✅ 7/7 |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-17T22:08Z
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-17T22:08Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
