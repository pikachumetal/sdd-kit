---
id: 20261009-110000-feature-0013-price-module
feature: 0013
title: Plan de implementación — Precio en su módulo
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Precio en su módulo

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: el cálculo del precio en `src/price.js`.

**Ejecución**: native, porque es una task de dos ficheros.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — `priceFor` en su módulo

**Tras**: —
**Tests RED**: hilo principal
**Superficies**: backend
**Verificación**: `node --test`
**Interfaces**:
- Consume: nada.
- Produce: `export function priceFor(room, day, hours)` en `src/price.js`, que devuelve `<n> €` o `sala desconocida: <sala>`; `run('precio', [room, day, hours])` devuelve `priceFor(room, day, hours)`.
**Ficheros**: `src/price.js` (crear), `src/app.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
