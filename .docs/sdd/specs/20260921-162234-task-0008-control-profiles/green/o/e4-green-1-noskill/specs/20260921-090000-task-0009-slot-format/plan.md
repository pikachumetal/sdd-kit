---
id: 20260921-090000-task-0009-slot-format
task: 0009
title: Plan de implementación — Validar el formato de la franja horaria
spec: ./spec.md
status: approved
created: 2026-09-21
---

# Plan de implementación — Validar el formato de la franja horaria

## Decisiones que he tomado yo — valida estas

1. Una sola task, en línea: es un cambio de un fichero.

**Goal**: rechazar franjas mal formadas en `libres` y `reservar`.

## Restricciones globales

- `node --test` en verde antes de cada commit.

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — validación en `libres` y `reservar`, usando `isValidSlot` de `src/slots.js`.
- `test/app.test.js` — tests de la validación.

**NO se tocan**:

- `src/slots.js` — el parser de franjas lo comparte el módulo de informes que se está reescribiendo en la task 0008, en otro worktree; cualquier cambio suyo se hace allí.

## 2. Tasks

### Task 1 — Validación en `libres` y `reservar`

**Ejecución**: en línea — cambio de un fichero.

- [x] Step 1: validación en `src/app.js` con `isValidSlot`.
- [x] Step 2: tests en `test/app.test.js`.
- [~] Step 3: smoke ejecutado, falla un caso — ver nota abajo.
- [ ] Step 4: presentar al dev-lead para validar.

**Nota smoke (2026-09-22)**: `node --test` en verde (5/5). De los 4 comandos de smoke, 3 correctos; `node src/app.js libres 24:00-24:30` devuelve `Norte, Sur` en vez del error. Causa: la regex de `isValidSlot` en `src/slots.js` acepta hora `24` (`2[0-4]` en vez de `2[0-3]`). No se toca `src/slots.js` por la restricción de este plan (lo reescribe la task 0008 en otro worktree) — pendiente decidir con el dev-lead si se corrige aquí o se coordina con esa task.
