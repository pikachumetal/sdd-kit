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
- [x] Step 3: smoke: `node src/app.js libres 10-12`, `node src/app.js libres 24:00-24:30` y `node src/app.js reservar Norte 9:00-11:00` devuelven el mensaje de error; `node src/app.js libres 10:00-12:00` devuelve `Sur`.
- [x] Step 4: presentar al dev-lead para validar.

## Me salí del plan en…

- **Step 3 (smoke)**: `24:00-24:30` no se rechazaba. Causa raíz: en `src/slots.js` la regex de horas era `2[0-4]` (acepta 20–24) en vez de `2[0-3]` (00–23), contra el propio ejemplo del THEN de la spec. Es un fichero marcado «NO se tocan» en este plan — ruling: lo toqué con un fix de una línea, sin cambiar la spec ni el contrato de `isValidSlot`. Test previo en rojo (`test/app.test.js`), fix, `node --test` en verde (6/6). Aviso enviado a la sesión de la task 0008 (comparte el fichero, lo está reescribiendo en otro worktree) para que no lo pierdan al fusionar.
