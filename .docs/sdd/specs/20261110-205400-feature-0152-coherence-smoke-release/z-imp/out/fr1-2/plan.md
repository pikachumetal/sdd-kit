---
id: 20261015-130000-feature-0033-duplicate-candidates
feature: 0033
title: Plan — Spike de candidatos a duplicado
spec: ./spec.md
status: approved
created: 2026-10-15
---

# Plan — Spike de candidatos a duplicado

**Goal**: contar los candidatos de la spec y dejar la recomendación.

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

### Task 1 — Contar los candidatos de las tres clases

**Tras**: —
**Evidencia**: O1 · salida en bruto y script que la saca, en la carpeta de la spec · fila de `research.md`.
**Verificación**: la salida en bruto existe en la carpeta de la spec

- [ ] **Step 1**: elegir el umbral de cada clase (`--min-sala`, `--min-motivo` y `--min-semanal`, sin tope por arriba) y contar con `node scripts/candidatos.mjs`; la salida en bruto y el script, a la carpeta de la spec.
- [ ] **Step 2**: escribir `research.md`, calcado de su plantilla de `sdd-templates`.
- [ ] **Step 3**: commit.

## 3. Validación final

- [ ] Gate de cierre: `node --test`
