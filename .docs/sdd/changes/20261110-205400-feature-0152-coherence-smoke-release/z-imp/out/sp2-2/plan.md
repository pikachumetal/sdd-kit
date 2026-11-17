---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan — Spike de carga de `libres`
spec: ./spec.md
status: approved
created: 2026-10-15
---

# Plan — Spike de carga de `libres`

**Goal**: medir los objetivos de la spec y dejar la recomendación.

**Ejecución**: native, porque es una task.

**Eje Arquitectura**: no — no cambia código.

## Restricciones globales

### De código

- Sin comentarios que repitan el código.

### De proceso

- Native.

## Review Focus

ninguna: comprobado

## 2. Tasks

### Task 1 — Medir `libres` con la peor carga

**Tras**: —
**Evidencia**: O1 · salida en bruto y script que la saca, en la carpeta de la spec · fila de `research.md`.
**Verificación**: la salida en bruto existe en la carpeta de la spec

- [ ] **Step 1**: medir con la carga de la spec; `seed` de `src/app.js` carga las reservas y `run('libres', [franja])` responde.
- [ ] **Step 2**: escribir `research.md`, calcado de su plantilla de `sdd-templates`.
- [ ] **Step 3**: commit.

## 3. Validación final

- [ ] Gate de cierre: `node --test`
