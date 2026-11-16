---
id: 20261116-113114-patch-0012-mensaje-cancelar
task: 0012
title: Patch — mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-11-16
branch: feature/0012
commit: pendiente
---

# Patch 0012 — mensaje de cancelar

Validación: dev-lead — el texto lo ve quien usa el comando `cancelar`.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición: «cambia el mensaje de cancelar: en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»».

## 2. Solución fijada

Frase literal del dev-lead: «en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»». Lo que da por existente, comprobado: `cancelBooking` en `src/app.js` devuelve `cancelada ${room} ${day}` y `test/cancel.test.js` lo exige.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `cancelBooking` devuelve `reserva cancelada: ${room} ${day}`.
- **Decisiones**:
  - Texto exacto `reserva cancelada: <sala> <día>` — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte lun` → «reserva cancelada: Norte lun» | ✅ RED: `node --test test/cancel.test.js` falló (actual «cancelada Norte lun», esperado «reserva cancelada: Norte lun»); GREEN: `node --test` 4/4, `node scripts/lint.mjs` sin hallazgos |

Revisión (sonnet): sin hallazgos bloqueantes. Observaciones menores: `commit` y `Esfuerzo real` pendientes y `status: done` previo al commit — se completan al cerrar con `sdd-archive`.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + 0,63 h del gate de cierre (38 min, patch 0007)
- Inicio: 2026-11-16T11:31Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
