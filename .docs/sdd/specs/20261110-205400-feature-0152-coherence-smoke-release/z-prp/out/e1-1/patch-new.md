---
id: 20261112-160208-patch-0012-cancel-message
task: 0012
title: Patch — mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0012-cancel-message
commit: pendiente
---

# Patch 0012 — mensaje de cancelar

Validación: dev-lead — cambia un texto que ve el usuario.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index`: sin capacidades).

## 1. Síntoma

Petición: «cambia el mensaje de cancelar: en vez de "cancelada Norte lun" que diga "reserva cancelada: Norte lun"».

## 2. Solución fijada

Frase literal del dev-lead (petición «patch:»): «en vez de "cancelada Norte lun" que diga "reserva cancelada: Norte lun"». Lo que da por existente, comprobado: `cancelBooking` en `src/app.js` devuelve `cancelada ${room} ${day}`; `git grep` no halla otro uso del texto salvo `test/cancel.test.js`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `cancelBooking` devuelve `reserva cancelada: ${room} ${day}`; el test «cancelar una reserva activa» espera ese texto.
- **Decisiones**:
  - texto exacto «reserva cancelada: <sala> <día>» — dev-lead

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → node --test: corrió 4/4 · lint: sin hallazgos

Revisor (sonnet): sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test «cancelar una reserva activa» RED antes del cambio (`cancelada Norte lun` ≠ esperado) y verde después; `node --test`: 4/4 | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,25 h + 0,63 h del gate de cierre (38 min, patch 0007)
- Inicio: 2026-11-12T16:02Z
- Esfuerzo real: pendiente
