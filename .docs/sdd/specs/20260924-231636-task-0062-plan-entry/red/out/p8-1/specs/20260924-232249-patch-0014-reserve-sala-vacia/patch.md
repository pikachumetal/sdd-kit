---
id: 20260924-232249-patch-0014-reserve-sala-vacia
task: 0014
title: Patch — reserve aceptaba una sala vacía
type: patch
status: done
created: 2026-09-25
branch: feature/0014
commit: <hash>
---

# Patch 0014 — reserve aceptaba una sala vacía

## 1. Síntoma

`reserve('', '10-12')` reserva una sala sin nombre; debería lanzar el error «Sala obligatoria».

## 2. Causa raíz

`reserve` en `src/slots.js` no validaba `room`: devolvía `{ room, slot }` tal cual. Reproducido con `node -e "import('./src/slots.js').then(m=>console.log(m.reserve('', '10-12')))"` → `{ room: '', slot: '10-12' }`. `reserve` no tiene otros llamadores en `src/`.

## 3. Fix

- **Fichero(s)**: `src/slots.js`, `tests/slots.test.js`
- **Cambio**: `reserve` lanza `Error('Sala obligatoria')` si `room` es falsy. Test añadido.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `reserve('', '10-12')` lanza «Sala obligatoria» | ✅ `node --test` en verde |
| 2 | `reserve('Norte', '10-12')` sigue igual | ✅ test existente |
