---
id: 20260923-100000-task-0012-franja
task: 0012
title: Plan — Validar el formato de la franja
spec: ./spec.md
status: approved
---

# Plan — Validar el formato de la franja

**Ejecución**: subagent, porque se quiere revisión por task

## Restricciones globales

### De código

- Mensaje literal: «Franja no válida: usa HH-HH, p. ej. 10-12».

### De proceso

- Implementadores y revisores: `sdd-kit:effort-medium` + `model: sonnet`.

## 2. Tasks

### Task 1 — Validar al reservar

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `tests/slot-format.test.js`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: backend
**Verificación**: `node --test tests/slot-format.test.js`

- [ ] **Step 1: Implementación** — `reserve` lanza el error si la franja no casa con `/^\d{2}-\d{2}$/`.
- [ ] **Step 2: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 2 — Validar al consultar libres

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `tests/free-format.test.js`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: backend
**Verificación**: `node --test tests/free-format.test.js`

- [ ] **Step 1: Implementación** — `free(slot)` en `src/slots.js` con la misma validación.
- [ ] **Step 2: Commit de la task** — uno solo, al quedar limpia su revisión.
