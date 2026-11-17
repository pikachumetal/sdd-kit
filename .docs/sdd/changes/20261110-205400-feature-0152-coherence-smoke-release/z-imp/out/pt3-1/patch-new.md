---
id: 20261112-184759-patch-0015-cancelar-anulada
task: 0015
title: Patch — el mensaje de cancelar dice «anulada»
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0015-cancelar-anulada
commit: pendiente
---

# Patch 0015 — el mensaje de cancelar dice «anulada»

Validación: dev-lead — cambia un texto que ve quien usa el comando.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

Petición: «el mensaje de cancelar pasa de «cancelada <sala> <día>» a «anulada <sala> <día>»; solución fijada por mí, dev-lead».

## 2. Solución fijada

Frase del dev-lead: «solución fijada por mí, dev-lead». Lo que da por existente, comprobado: `cancelBooking` en `src/app.js` devuelve `cancelada ${room} ${day}` y `test/cancel.test.js` lo asevera.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `cancelBooking` devuelve `anulada ${room} ${day}`; el test espera lo mismo.
- **Decisiones**:
  - El texto exacto «anulada <sala> <día>» — dev-lead
- **Aviso**: `PRODUCT.md` distingue Cancelación (cliente) de Anulación (responsable) y `anular` ya responde «anulada …»; tras el cambio ambos comandos dan el mismo mensaje. Decisión del dev-lead, no bloquea.

## 4. Verificación

Gate: `node --test` → 4/4.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/cancel.test.js` → actual `cancelada Norte lun`, esperado `anulada Norte lun` | ✅ falla por lo esperado |
| 2 | GREEN: `node --test` → pass 4, fail 0 | ✅ |

Revisor del patch (sonnet): sin hallazgos de fondo. El texto antiguo no queda en `src/` ni `test/`; las otras apariciones son prosa del roadmap («canceladas») y las citas del propio `patch.md`.
