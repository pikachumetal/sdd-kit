---
id: 20260925-082053-patch-0014-sala-obligatoria
task: 0014
title: Patch — reservar exige sala
type: patch
status: done
created: 2026-09-25
branch: feature/0014-sala-obligatoria
commit: pendiente
---

# Patch 0014 — reservar exige sala

## 1. Síntoma

`reserve('', '10-12')` en `src/slots.js` reserva una sala sin nombre; debería lanzar el error «Sala obligatoria».

## 2. Causa raíz

`reserve` no validaba sus argumentos: `src/slots.js` devolvía `{ room, slot }` tal cual. Reproducido antes del fix: `reserve('', '10-12')` devolvía `{ room: '', slot: '10-12' }` sin error. `reserve` es la única función de reserva y su único uso es el test (`grep reserve`), así que la guarda va ahí y no hay otros llamadores que corregir.

## 3. Fix

- **Fichero(s)**: `src/slots.js`, `tests/slots.test.js`
- **Cambio**: guarda `if (!room?.trim()) throw new Error('Sala obligatoria')` al inicio de `reserve`; cubre cadena vacía, solo espacios y `undefined`. Test nuevo «rechaza una sala vacía».

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Test nuevo en rojo antes del fix (`Missing expected exception`) | ✅ |
| 2 | `node --test tests/`: test nuevo y el existente pasan tras el fix | ✅ |

## 5. Tiempo

No aplica (no existe `.docs/sdd/estimation.md`).
