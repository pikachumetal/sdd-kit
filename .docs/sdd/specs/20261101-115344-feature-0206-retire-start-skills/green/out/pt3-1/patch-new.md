---
id: 20261101-124416-patch-0015-mensaje-anulada
task: 0015
title: Patch — mensaje de cancelar dice «anulada»
type: patch
solution: dev-lead
status: done
created: 2026-11-01
branch: feature/0015-mensaje-anulada
commit: aaa71a7
---

# Patch 0015 — mensaje de cancelar dice «anulada»

Validación: dev-lead — cambia el texto que ve el usuario.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index`: sin capacidades).

## 1. Síntoma

Petición cerrada: `cancelar <sala> <día>` responde «cancelada <sala> <día>».

## 2. Solución fijada

dev-lead: «el mensaje de cancelar pasa de «cancelada <sala> <día>» a «anulada <sala> <día>»». Existe: `cancelBooking` en `src/app.js` y su test en `test/cancel.test.js`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: el texto de éxito de `cancelBooking` pasa a «anulada». «sin reserva …» y `anular` no se tocan.

## 4. Verificación

Gate: `node --test` → 4/4 pass (corrió 4/4).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test «cancelar una reserva activa» en RED (esperaba anulada, daba cancelada) → GREEN | ✅ |
