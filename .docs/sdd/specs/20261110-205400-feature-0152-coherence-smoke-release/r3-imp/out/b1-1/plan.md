---
id: 20261014-140000-feature-0027-free-rooms-empty
feature: 0027
title: Plan de implementación — Libres sin salas
spec: ./spec.md
status: approved
created: 2026-10-14
---

# Plan de implementación — Libres sin salas

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: `libres` sin salas, con su línea del README.

**Ejecución**: native, porque es una task en pocos ficheros.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; skills en inglés.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Libres sin salas

**Tras**: —
**Tests RED**: `test/free.test.js`
**Superficies**: código y README
**Verificación**: `node --test`
**Interfaces**:
- Consume: `run` de `src/app.js`.
- Produce: la respuesta `sin salas` y la línea de `libres` en «Comandos» del README.
**Ficheros**: Modificar: `src/app.js`, `README.md` (solo la línea de `libres`, en «Comandos»). Crear: `test/free.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
