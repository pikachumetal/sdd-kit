---
id: 20261016-110000-feature-0036-saved-cancellations
feature: 0036
title: Plan de implementación — Las cancelaciones se conservan entre ejecuciones
spec: ./spec.md
status: approved
created: 2026-10-16
---

# Plan de implementación — Las cancelaciones se conservan entre ejecuciones

## Decisiones que he tomado yo — valida estas

1. Una task, Native, que toca las dos capas: el almacén y la CLI.

**Goal**: guardar las reservas al cancelar y recargarlas al arrancar.

**Ejecución**: native, porque es una task corta.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Almacén y cancelar

**Tras**: —
**Tests RED**: ya escrito por el dev-lead en el árbol, sin commitear · `test/persist.test.js`
**Superficies**: backend
**Verificación**: `node --test test/persist.test.js`
**Interfaces**:
- Consume: el array `bookings` de `src/app.js` (`{ room, day, slot, status }`) y `cancelBooking(room, day)`.
- Produce: `load(fallback)` y `save(bookings)` en `src/store.js` (`data/bookings.json` del directorio actual; `load` devuelve `fallback` si el fichero no existe), y `cancelar` que llama a `save` tras cancelar.
**Ficheros**: `src/store.js` (crear), `src/app.js`, `test/persist.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
