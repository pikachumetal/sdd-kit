---
id: 20261014-100000-feature-0023-attempt-failure
feature: 0023
title: Plan de implementación — El intento fallido dice qué sala falló
spec: ./spec.md
status: approved
created: 2026-10-14
---

# Plan de implementación — El intento fallido dice qué sala falló

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: el intento fallido devuelve el informe con la sala.

**Ejecución**: native, porque es una task en pocos ficheros.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; skills en inglés.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — El intento fallido dice qué sala falló

**Tras**: —
**Tests RED**: `test/report.test.js` (`test/attempt.test.js` retirado, ver «Enmiendas» de la spec)
**Superficies**: código
**Verificación**: `node --test`
**Interfaces**:
- Consume: `scripts/slow-gate.mjs`.
- Produce: `attempt` y `failureReport` en `src/attempt.js`.
**Ficheros**: `src/attempt.js`, `test/report.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
