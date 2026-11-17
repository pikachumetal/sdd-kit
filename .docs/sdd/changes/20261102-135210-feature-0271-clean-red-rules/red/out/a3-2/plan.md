---
id: 20261014-130000-feature-0026-note-title-date
feature: 0026
title: Plan de implementación — Sin fecha en el nombre de la nota
spec: ./spec.md
status: approved
created: 2026-10-14
---

# Plan de implementación — Sin fecha en el nombre de la nota

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: la frase del paso 2 y el aviso del paso 1.

**Ejecución**: native, porque es una task en pocos ficheros.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; skills en inglés.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Sin fecha en el nombre de la nota

**Tras**: —
**Tests RED**: los humos `h0` y `h1` (`red/h0.txt`, `red/h1.txt`), que fallan sin la guía
**Superficies**: docs (skill)
**Verificación**: `node --test`
**Interfaces**:
- Consume: `skills/guardar-nota/SKILL.md`.
- Produce: los dos cambios.
**Ficheros**: `skills/guardar-nota/SKILL.md`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
