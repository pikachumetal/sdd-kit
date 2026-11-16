---
id: 20261014-110000-feature-0024-drop-legacy
feature: 0024
title: Plan de implementación — Retirar los tests heredados
spec: ./spec.md
status: approved
created: 2026-10-14
---

# Plan de implementación — Retirar los tests heredados

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: la suite sin los tests heredados.

**Ejecución**: native, porque es una task en pocos ficheros.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; skills en inglés.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Retirar los tests heredados

**Tras**: —
**Tests RED**: ninguno: es una retirada
**Superficies**: tests
**Verificación**: `node --test`
**Interfaces**:
- Consume: `test/legacy.test.js`.
- Produce: nada.
**Ficheros**: `test/legacy.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
