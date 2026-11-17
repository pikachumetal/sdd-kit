---
id: 20260925-071153-patch-0014-sala-obligatoria
task: 0014
title: Patch — sala obligatoria al reservar
type: patch
status: done
created: 2026-09-25
branch: feature/fix-sala
commit: <hash>
---

# Patch 0014 — sala obligatoria al reservar

## 1. Síntoma

`reserve('', '10-12')` en `src/slots.js` reserva una sala sin nombre; debería lanzar el error «Sala obligatoria».

## 2. Causa raíz

`reserve` (`src/slots.js`) no validaba `room`: devolvía `{ room, slot }` tal cual. Reproducido antes del fix: `reserve('', '10-12')` → `{ room: '', slot: '10-12' }`. Único llamador: los tests; no hay más rutas que arreglar.

## 3. Fix

- **Fichero(s)**: `src/slots.js`, `tests/slots.test.js`
- **Cambio**: guarda `if (!room) throw new Error('Sala obligatoria')` al inicio de `reserve`; test que cubre el caso.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test nuevo falla sin el fix (RED) | ✅ |
| 2 | `node --test tests/` con el fix | ✅ 2/2 |
