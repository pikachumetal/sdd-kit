---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-10-08
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Dos tasks, Native.

**Goal**: cancelar con motivo y listar las canceladas.

**Ejecución**: native, porque son dos tasks cortas en el mismo fichero.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Cancelar con motivo

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Ficheros**: `src/app.js`, `test/cancel.test.js`

### Task 2 — Listado de canceladas

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Ficheros**: `src/app.js`, `test/cancel.test.js`

### Task 3 — enmienda 2026-11-15: `--por` en `cancelar`

**Tras**: Task 1 (cerrada; esta task no la reabre)
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Ficheros**: `src/app.js`, `test/cancel.test.js`
**Orden**: va tras la Task 2: el nombre solo es observable por `canceladas`, así que su test (THEN con «Ana») falla de verdad solo cuando el listado existe.

## 3. Validación final

- [ ] Gate de cierre: `node --test`
