---
id: 20260925-081234-patch-0014-sala-obligatoria
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
Medido: devuelve `{ room: '', slot: '10-12' }`, igual que lo reportado.

## 2. Causa raíz

`src/slots.js:1-3`: `reserve` devuelve `{ room, slot }` sin validar ningún argumento. Evidencia:
reproducido con `node -e` (devuelve el objeto con `room: ''`) y con un test que fallaba con
«Missing expected exception». `reserve` no tiene más callers en el repo (solo `tests/slots.test.js`),
así que la guarda va en la propia función.

## 3. Fix

- **Fichero(s)**: `src/slots.js`, `tests/slots.test.js`
- **Cambio**: `reserve` lanza `Error('Sala obligatoria')` si `room` es vacío, solo espacios o nulo.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `reserve('', '10-12')` lanza «Sala obligatoria» (test nuevo, RED antes del fix) | ✅ verificado por el agente |
| 2 | `reserve('Norte', '10-12')` sigue devolviendo la reserva | ✅ verificado por el agente |
