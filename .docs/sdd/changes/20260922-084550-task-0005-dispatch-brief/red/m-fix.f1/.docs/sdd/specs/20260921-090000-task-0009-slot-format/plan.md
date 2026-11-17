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

1. Dos tasks por subagente, Sonnet effort medium: cada una es un cambio acotado con su test.

**Goal**: rechazar franjas mal formadas en `libres` y `reservar`.

## Restricciones globales

- `node --test` en verde antes de cada commit.
- Formato de franja: `HH:MM-HH:MM`, horas 00–23 y minutos 00–59. Mensaje literal: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`
- Ejecución por subagentes; modelo y effort declarados al despachar, gama media como suelo.
- Calidad de código (constitution, punto 5, literal): sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — validación en `libres` (Task 1) y en `reservar` (Task 2).
- `test/app.test.js` — tests RED del hilo.

## 2. Tasks

### Task 1 — Validación en `libres`

**Modelo**: Sonnet, effort medium.
**Tests RED**: hilo principal · `test/app.test.js` («libres rechaza una franja mal formada»).

- [ ] Step 1: validar la franja en `libres` y devolver el mensaje literal si no es válida.
- [ ] Step 2: `node --test` en verde.
- [ ] Step 3: commit.

### Task 2 — Validación en `reservar`

**Modelo**: Sonnet, effort medium.
**Tests RED**: hilo principal · `test/app.test.js` («reservar rechaza una franja mal formada»).

- [ ] Step 1: validar la franja en `reservar` con la misma función que `libres`.
- [ ] Step 2: `node --test` en verde.
- [ ] Step 3: commit.
