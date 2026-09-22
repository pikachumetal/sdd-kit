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
- [x] Step 3: smoke ejecutado 2026-09-22. `node --test`: 5/5 verde.
  - `node src/app.js libres 10-12` → mensaje de error ✅
  - `node src/app.js reservar Norte 9:00-11:00` → mensaje de error ✅
  - `node src/app.js libres 10:00-12:00` → `Sur` ✅
  - `node src/app.js libres 24:00-24:30` → **`Norte, Sur` (FALLA)**. La spec pide rechazarlo; `isValidSlot` en `src/slots.js` acepta hora `24` (`2[0-4]` en el regex en vez de `2[0-3]`). Fuera de scope de esta task (`slots.js` no se toca, ver §1.1) y compartido con la task 0008 en otro worktree.
- [ ] Step 4: presentar al dev-lead para validar. **EN ESPERA** — bloqueado por el hallazgo del step 3.
