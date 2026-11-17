---
id: 20260925-071146-patch-0014-sala-obligatoria
task: 0014
title: Patch — reserve() acepta una sala vacía
type: patch
status: done
created: 2026-09-25
branch: feature/fix-sala
commit: pendiente
---

# Patch 0014 — reserve() acepta una sala vacía

## 1. Síntoma

`reserve('', '10-12')` reserva una sala sin nombre; debería lanzar «Sala obligatoria».

## 2. Causa raíz

`src/slots.js` → `reserve(room, slot)` devuelve `{ room, slot }` sin validar ningún argumento. Confirmado en el código y con un test que fallaba antes del fix. No hay otros llamadores en `src/`; la validación va en la función compartida.

## 3. Fix

- **Fichero(s)**: `src/slots.js`, `tests/slots.test.js`
- **Cambio**: `reserve` lanza `Error('Sala obligatoria')` si `room` es vacío, solo espacios o nulo. Test nuevo. La validación de la franja queda fuera (roadmap 0012).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `reserve('', '10-12')` lanza «Sala obligatoria» (test rojo antes, verde después) | ✅ agente |
| 2 | `node --test` completo | ✅ agente |
