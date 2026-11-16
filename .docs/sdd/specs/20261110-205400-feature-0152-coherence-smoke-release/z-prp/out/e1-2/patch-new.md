---
id: 20261112-163100-patch-0012-mensaje-cancelar
task: 0012
title: Patch — mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0012-mensaje-cancelar
commit: <hash>
---

# Patch 0012 — mensaje de cancelar

Validación: dev-lead — el texto lo lee una persona en la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición, literal: «cambia el mensaje de cancelar: en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»».

## 2. Solución fijada (petición cerrada)

Frase del dev-lead (autor: dev-lead): «en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»». Lo que da por existente, comprobado: `cancelBooking` en `src/app.js:17` devuelve `` `cancelada ${room} ${day}` `` y `test/cancel.test.js:6` lo fija.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: el mensaje de una cancelación hecha pasa a `reserva cancelada: <sala> <día>`. `sin reserva …` y `anulada …` no cambian.
- **Decisiones**:
  - Texto literal `reserva cancelada: <sala> <día>` — dev-lead

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → corrió 4/4 · lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte lun`: RED (esperaba `reserva cancelada: Norte lun`, dio `cancelada Norte lun`) → GREEN tras el fix | ✅ |
| 2 | Resto de la suite (4 tests) y lint | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,2 h + 0,63 h del gate de cierre (38 min, patch 0007)
- Inicio: 2026-11-12T16:25Z
- Esfuerzo real: <se rellena al cerrar>
- Coste de sujetos: no aplica
