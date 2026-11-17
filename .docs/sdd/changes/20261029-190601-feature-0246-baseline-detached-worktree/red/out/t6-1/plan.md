---
id: 20261014-100000-feature-0022-scripts-to-node
feature: 0022
title: Plan de implementación — Los scripts del repo, a Node
spec: ./spec.md
status: approved
created: 2026-10-14
---

# Plan de implementación — Los scripts del repo, a Node

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: Sin bash en `scripts/`.

**Ejecución**: native, porque es una task pequeña.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Los scripts de bash, a Node

**Tras**: —
**Tests RED**: hilo principal · `test/no-bash.test.js`
**Superficies**: tooling
**Verificación**: `node --test test/no-bash.test.js`
**Interfaces**:
- Consume: los ficheros de `scripts/`.
- Produce: `scripts/deploy.mjs`, que imprime `desplegado`.
**Ficheros**: `scripts/`, `test/no-bash.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
