---
id: 20261009-150000-feature-0017-reactivate
feature: 0017
title: Plan de implementación — Reactivar una reserva cancelada
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Reactivar una reserva cancelada

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: Comando `reactivar`.

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

### Task 1 — Comando `reactivar`

**Tras**: —
**Tests RED**: hilo principal · `test/reactivar.test.js`
**Superficies**: backend
**Verificación**: `node --test test/reactivar.test.js`
**Interfaces**:
- Consume: el array `bookings` de `src/app.js` (`{ room, day, slot, status }`, `status` en `active`, `cancelled` o `voided`).
- Produce: `run('reactivar', [sala, día])` → `reactivada <sala> <día>` o `sin cancelada <sala> <día>`.
**Ficheros**: `src/app.js`, `test/reactivar.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
