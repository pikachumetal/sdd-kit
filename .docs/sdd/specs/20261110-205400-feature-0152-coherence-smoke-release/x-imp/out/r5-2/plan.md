---
id: 20261009-120000-feature-0014-saved-reason
feature: 0014
title: Plan de implementación — Motivo guardado
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Motivo guardado

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: guardar el motivo.

**Ejecución**: native, porque es una task en un fichero.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Guardar el motivo

**Tras**: —
**Tests RED**: hilo principal · `test/store.e2e.test.js`
**Superficies**: backend
**Verificación**: `node --test test/store.e2e.test.js`
**Interfaces**:
- Consume: `persist(bookings)` de `src/store.js`.
- Produce: la reserva cancelada lleva `reason` al llamar a `persist`.
**Ficheros**: `src/app.js`, `test/store.e2e.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
