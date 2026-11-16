---
id: 20261115-142748-patch-0015-anulada-al-cancelar
task: 0015
title: Patch — «anulada» en el mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-11-15
branch: feature/0015-anulada-al-cancelar
commit: be66986
---

# Patch 0015 — «anulada» en el mensaje de cancelar

Validación: dev-lead — el texto lo ve quien usa `cancelar`.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (no existe `capabilities/`).

## 1. Síntoma

Petición del dev-lead: «el mensaje de cancelar pasa de «cancelada <sala> <día>» a «anulada <sala> <día>»».

## 2. Solución fijada

Frase literal del dev-lead: «el mensaje de cancelar pasa de «cancelada <sala> <día>» a «anulada <sala> <día>»; solución fijada por mí, dev-lead». Lo que da por existente, comprobado: `cancelBooking` en `src/app.js` devuelve hoy `cancelada ${room} ${day}`, y `test/cancel.test.js` lo cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `cancelBooking` responde `anulada <sala> <día>`; el test espera ese texto.
- **Decisiones**:
  - Texto exacto `anulada <sala> <día>` — dev-lead
  - Nota: `voidBooking` ya devolvía ese mismo texto, así que cancelar y anular responden igual. Se deja como está porque el dev-lead fijó la solución — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node --test test/cancel.test.js` en RED antes del cambio: esperaba `anulada Norte lun`, recibía `cancelada Norte lun` | ✅ falló por lo esperado |
| 2 | `node --test` tras el cambio: 4 tests, 4 pasan, 0 fallan | ✅ |

Revisión del patch (revisor sonnet): sin hallazgos bloqueantes. Dos observaciones informativas: cancelar y anular responden el mismo texto (ya anotado en §3, decisión del dev-lead) y no hay test de `anular` (fuera de alcance). Rechazadas como acción: no cambian el fix.
