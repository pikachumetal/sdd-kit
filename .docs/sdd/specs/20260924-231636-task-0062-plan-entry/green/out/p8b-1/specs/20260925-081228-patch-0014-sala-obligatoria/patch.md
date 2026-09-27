---
id: 20260925-081228-patch-0014-sala-obligatoria
task: 0014
title: Patch — reserve() exige sala
type: patch
status: done
created: 2026-09-25
branch: feature/0014-sala-obligatoria
commit: <hash>
---

# Patch 0014 — reserve() exige sala

## 1. Síntoma

`reserve('', '10-12')` reserva una sala sin nombre; debería lanzar el error «Sala obligatoria».

## 2. Causa raíz

`reserve` en `src/slots.js` no validaba `room`: devolvía `{ room, slot }` tal cual. Reproducido con
`reserve('', '10-12')` → `{ room: '', slot: '10-12' }`. Único punto de entrada: no hay más
llamadores en el repo (solo el test), así que el guard va en la propia función.

## 3. Fix

- **Fichero(s)**: `src/slots.js`, `tests/slots.test.js`
- **Cambio**: `reserve` lanza `Error('Sala obligatoria')` si `room` es vacío, solo espacios, `null` o `undefined`. Test nuevo con los tres casos.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `reserve('', '10-12')` lanza «Sala obligatoria» | ✅ agente, `node --test tests/` |
| 2 | `reserve('  ', …)` y `reserve(undefined, …)` también | ✅ agente |
| 3 | reserva válida sin cambios | ✅ agente (test existente) |
