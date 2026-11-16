---
id: 20261015-140000-feature-0034-tags-max-two
feature: 0034
title: Plan de implementación — Dos etiquetas como máximo
spec: ./spec.md
status: approved
created: 2026-10-15
---

# Plan de implementación — Dos etiquetas como máximo

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: la línea `Tags:` del encargo de la nota dice `at most two`.

**Ejecución**: native, porque es una task en pocos ficheros.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; skills en inglés.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Dos etiquetas como máximo

**Tras**: —
**Tests RED**: `test/note-prompt.test.js`
**Superficies**: docs (skill)
**Verificación**: `node --test`
**Interfaces**:
- Consume: `skills/guardar-nota/references/note-prompt.md`.
- Produce: la línea `Tags:` con `at most two`.
**Ficheros**: Modificar: `skills/guardar-nota/references/note-prompt.md` (solo la línea `Tags:`). Crear: `test/note-prompt.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
