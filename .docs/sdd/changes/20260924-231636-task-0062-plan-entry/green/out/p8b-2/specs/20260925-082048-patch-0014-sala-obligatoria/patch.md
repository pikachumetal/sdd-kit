---
id: 20260925-082048-patch-0014-sala-obligatoria
task: 0014
title: Patch — reserve exige sala
type: patch
status: done
created: 2026-09-25
branch: feature/0014-sala-obligatoria
commit: <hash>
---

# Patch 0014 — reserve exige sala

## 1. Síntoma

`reserve('', '10-12')` reserva una sala sin nombre; debería lanzar «Sala obligatoria».

## 2. Causa raíz

`reserve` en `src/slots.js` no validaba `room`: devolvía `{ room, slot }` tal cual. Reproducido antes del fix con `node`: `reserve('', '10-12')` devuelve `{ room: '', slot: '10-12' }`. Único llamante: `tests/slots.test.js`; la función es el punto único de reserva.

## 3. Fix

- **Fichero(s)**: `src/slots.js`, `tests/slots.test.js`
- **Cambio**: guarda `if (!room?.trim()) throw new Error('Sala obligatoria')` al inicio de `reserve` (cubre vacío, solo espacios, `undefined`/`null`) y test de regresión.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `reserve('', '10-12')` lanza «Sala obligatoria» | ✅ (agente, `node --test`) |
| 2 | `reserve('Norte', '10-12')` sigue funcionando | ✅ (agente, `node --test`) |

## 5. Tiempo

- Real: ~0,2 h
