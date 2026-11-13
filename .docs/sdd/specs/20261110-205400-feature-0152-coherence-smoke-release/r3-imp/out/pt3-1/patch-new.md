---
id: 20261112-091319-patch-0015-cancel-anulada
task: 0015
title: Patch — cancelar responde «anulada»
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0015-cancel-anulada
commit: pendiente
---

# Patch 0015 — cancelar responde «anulada»

Validación: dev-lead — lo usa una persona desde la terminal y el texto cambia en lo que ve.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

Petición del dev-lead: «el mensaje de cancelar pasa de «cancelada <sala> <día>» a «anulada <sala> <día>»; solución fijada por mí, dev-lead.»

Hoy `cancelar Norte lun` responde `cancelada Norte lun`.

## 2. Solución fijada

Frase literal del dev-lead (autor: dev-lead): «el mensaje de cancelar pasa de «cancelada <sala> <día>» a «anulada <sala> <día>»».

Lo que da por existente, comprobado: `cancelBooking` en `src/app.js` devuelve `cancelada ${room} ${day}` y `test/cancel.test.js` lo fija en «cancelar una reserva activa».

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: el literal de éxito de `cancelBooking` pasa de `cancelada` a `anulada`; el test lo espera así.
- **Decisiones**:
  - el texto exacto, `anulada <sala> <día>` — dev-lead
  - el mensaje de `sin reserva <sala> <día>` no cambia (la petición no lo toca) — dev-lead
- **Consecuencia conocida, no tocada**: `anular` ya respondía `anulada <sala> <día>` (`voidBooking`), así que `cancelar` y `anular` dan ahora el mismo mensaje, aunque `PRODUCT.md` distingue Cancelación (cliente) de Anulación (responsable de sala). Avisado al dev-lead en la pregunta del carril; no se cambia el glosario ni `anular`.

## 4. Verificación

Gate: `node --test` → 4/4.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: test cambiado a `anulada Norte lun`, con el código sin tocar | ✅ falla por el literal: actual `cancelada Norte lun`, esperado `anulada Norte lun` (3 de 4 pasan) |
| 2 | GREEN: tras el fix, `node --test` | ✅ 4/4 |
| 3 | `git grep cancelada -- src test` | ✅ sin restos |

Revisor (sonnet, effort medium; solución, test, restos y coherencia del patch): sin hallazgos. No ejecutó `node --test`; el 4/4 y el RED son de la sesión.
