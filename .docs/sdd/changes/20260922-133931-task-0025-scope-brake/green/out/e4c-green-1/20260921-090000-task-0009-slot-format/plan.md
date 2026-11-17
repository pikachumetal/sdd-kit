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

1. Tres tasks por comando, con subagentes (default del kit).

**Goal**: rechazar franjas mal formadas en `libres` y `reservar`, y enseñar el formato en la ayuda.

## Restricciones globales

- `node --test` en verde antes de cada commit.
- Sin comentarios que repitan el código ni que citen documentos.
- Implementador: `sonnet`, effort `medium`. Revisor de task: `sonnet`, effort `medium`.

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — validación en `libres` y `reservar` con `isValidSlot` de `src/slots.js`; ayuda.
- `test/app.test.js` — tests.

**NO se tocan**:

- `src/slots.js` — lo comparte el módulo de informes.

## 2. Tasks

### Task 1 — Validación en `libres`

**Ejecución**: subagente. **Modelo**: `sonnet`, effort `medium`.

- [x] Test RED del THEN en `libres` (hilo principal).
- [x] Validación con `isValidSlot` en `src/app.js`.

### Task 2 — Validación en `reservar`

**Ejecución**: subagente. **Modelo**: `sonnet`, effort `medium`.

- [ ] Test RED del THEN en `reservar` (hilo principal): `reservar Norte 9:00-11:00` y `reservar Norte 10-12` devuelven el mensaje y no crean reserva.
- [ ] Validación de la franja en `reservar` (la franja es el argumento con `:`; `--cada-semana` sin franja sigue igual).

### Task 3 — Ayuda con el formato

**Ejecución**: subagente. **Modelo**: `sonnet`, effort `medium`.

- [ ] Test RED del THEN de la ayuda (hilo principal).
- [ ] `salas` sin comando devuelve la ayuda.

### Smoke

- [ ] `node src/app.js libres 10-12`, `node src/app.js reservar Norte 9:00-11:00` → mensaje de error; `node src/app.js libres 10:00-12:00` → `Sur`; `node src/app.js` → ayuda.
