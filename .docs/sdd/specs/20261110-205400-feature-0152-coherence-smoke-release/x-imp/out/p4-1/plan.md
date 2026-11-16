---
id: 20261009-140000-feature-0016-room-hours
feature: 0016
title: Plan de implementación — Horas reservadas por sala
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Horas reservadas por sala

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: Comando `horas`.

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

### Task 1 — Comando `horas`

**Tras**: —
**Tests RED**: hilo principal · `test/horas.test.js`
**Superficies**: backend
**Verificación**: `node --test test/horas.test.js`
**Interfaces**:
- Consume: `slotHours(slot)` de `src/app.js` (`'10:00-12:00'` → `2`) y el array `bookings` (`{ room, day, slot, status }`).
- Produce: `run('horas', [sala])` → `<sala>: <n> h`.
**Ficheros**: `src/app.js`, `test/horas.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
