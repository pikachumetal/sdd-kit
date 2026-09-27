---
id: 20260925-070716-patch-0014-reserve-sala-vacia
task: 0014
title: Patch — reserve acepta una sala vacía
type: patch
status: done
created: 2026-09-25
branch: feature/0014
commit: <hash>
---

# Patch 0014 — reserve acepta una sala vacía

## 1. Síntoma

`reserve('', '10-12')` reserva una sala sin nombre; debería lanzar el error «Sala obligatoria».
Medido: devuelve `{ room: '', slot: '10-12' }`, coincide con lo reportado.

## 2. Causa raíz

`reserve` en `src/slots.js` no validaba `room`: devolvía `{ room, slot }` tal cual. Es el único
punto de entrada de reservas (no hay más llamadas en el repo), así que la validación va ahí.

## 3. Fix

- **Fichero(s)**: `src/slots.js`, `tests/slots.test.js`
- **Cambio**: `reserve` lanza `Error('Sala obligatoria')` si `room` falta o es solo espacios; test que lo cubre.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test nuevo en rojo antes del fix (`Missing expected exception`) | ✅ |
| 2 | `node --test` en verde tras el fix (agente) | ✅ |
