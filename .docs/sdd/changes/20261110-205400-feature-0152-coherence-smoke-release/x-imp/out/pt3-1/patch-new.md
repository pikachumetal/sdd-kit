---
id: 20261112-205312-patch-0015-anulada-mensaje
task: 0015
title: Patch — mensaje de cancelar pasa a «anulada»
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0015-anulada-mensaje
commit: pendiente
---

# Patch 0015 — mensaje de cancelar pasa a «anulada»

Validación: dev-lead — cambia el texto que ve quien usa `cancelar`.

## Capacidades

- Ninguna, porque ninguna capacidad describe el mensaje de `cancelar` (no existe `capabilities/`).

## 1. Síntoma

Petición del dev-lead: «el mensaje de cancelar pasa de «cancelada <sala> <día>» a «anulada <sala> <día>»; solución fijada por mí, dev-lead».

## 2. Solución fijada

«cancelada <sala> <día>» → «anulada <sala> <día>», autor: dev-lead. Lo que da por existente, comprobado: `cancelBooking` en `src/app.js:17` devuelve `cancelada ${room} ${day}` y `test/cancel.test.js:6` lo afirma.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: el literal de `cancelBooking` pasa a `anulada ${room} ${day}`; el test espera `anulada Norte lun`.
- **Decisiones**:
  - Texto exacto del mensaje — dev-lead
- **Aviso de terminología** (anotado, no decidido aquí): `PRODUCT.md` distingue Cancelación (cliente, `cancelar`) de Anulación (responsable, `anular`). Tras el cambio `cancelar` y `anular` responden lo mismo y el mensaje ya no dice cuál ha ocurrido. No se toca `PRODUCT.md` ni `anular`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/cancel.test.js` con el test ya en `anulada Norte lun` | ✅ falló: actual `cancelada Norte lun`, expected `anulada Norte lun` |
| 2 | GREEN: `node --test` entero tras el fix | ✅ `ℹ tests 4 · pass 4 · fail 0` |

**Revisor (sonnet)**

1. Finales de línea: el diff reescribía los dos ficheros enteros (HEAD en CRLF, copia de trabajo en LF) — corregido: restaurado CRLF, `git diff --stat` = 2 líneas por fichero, `node --test` 4/4.
2. «ver abajo» sin evidencia — corregido: la fila 2 lleva la salida.
3. RED sin evidencia — corregido: la fila 1 lleva el comando y el fallo.
