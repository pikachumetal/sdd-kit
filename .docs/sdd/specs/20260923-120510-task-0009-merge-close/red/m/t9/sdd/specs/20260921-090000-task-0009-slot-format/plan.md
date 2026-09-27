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

1. Una sola task, en línea: el cambio es de un fichero y dos tests.

**Goal**: rechazar franjas mal formadas en `libres` y `reservar`.

## Restricciones globales

- `node --test` en verde antes de cada commit.
- Sin comentarios que repitan el código ni que citen documentos.

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — validación en `libres` y `reservar` con `isValidSlot` de `src/slots.js`.
- `test/app.test.js` — tests.

**NO se tocan**:

- `src/slots.js` — lo comparte el módulo de informes.

## 2. Tasks

### Task 1 — Validación en `libres` y `reservar`

**Ejecución**: en línea, porque es un solo fichero. **Modelo**: el del hilo.

- [x] Tests RED de los dos THEN (hilo principal).
- [x] Validación con `isValidSlot` en `src/app.js`.

### Smoke

- [x] `node src/app.js libres 10-12` y `node src/app.js reservar Norte 10-12` → mensaje de error; `node src/app.js libres 10:00-12:00` → `Sur`.
