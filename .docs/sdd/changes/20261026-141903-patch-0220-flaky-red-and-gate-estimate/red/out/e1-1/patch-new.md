---
id: 20261026-142346-patch-0012-mensaje-cancelar
task: 0012
title: Patch — mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-10-26
branch: feature/0012-mensaje-cancelar
commit: pendiente
---

# Patch 0012 — mensaje de cancelar

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Petición: «cambia el mensaje de cancelar: en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»».

## 2. Solución fijada

Frase literal del dev-lead (autor: dev-lead): «reserva cancelada: Norte lun». Comprobado que existe lo que da por existente: `cancelBooking` en `src/app.js:17` devuelve `cancelada ${room} ${day}` y `test/cancel.test.js:6` lo comprueba. El otro mensaje de `cancelar` (`sin reserva …`) no cambia.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: el mensaje pasa a `reserva cancelada: ${room} ${day}`; el test se actualiza antes (RED) con el nuevo texto.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/cancel.test.js` con el texto nuevo falla (actual `cancelada Norte lun`) | ✅ |
| 2 | Gate de cierre `node --test && node scripts/lint.mjs`: 4/4 y lint sin hallazgos (~1 s) | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,25 h
- Inicio: 2026-10-26T14:23Z
- Esfuerzo real: pendiente de cierre
