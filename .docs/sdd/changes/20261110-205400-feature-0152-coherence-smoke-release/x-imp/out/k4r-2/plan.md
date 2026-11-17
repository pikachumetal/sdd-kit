---
id: 20261016-100000-feature-0028-note-tags-kept-flags
feature: 0028
title: Plan de implementación — Etiquetas en la nota, con las red flags de guardar-nota
spec: ./spec.md
status: approved
created: 2026-10-16
---

# Plan de implementación — Etiquetas en la nota, con las red flags de guardar-nota

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: el paso de las etiquetas en `guardar-nota`.

**Ejecución**: native, porque es una task en pocos ficheros.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; skills en inglés.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Etiquetas en la nota, con las red flags de guardar-nota

**Tras**: —
**Tests RED**: el humo `h1`, que falla sin el paso
**Superficies**: docs (skill)
**Verificación**: `node --test`
**Interfaces**:
- Consume: `skills/guardar-nota/SKILL.md`.
- Produce: el paso 4.
**Ficheros**: `skills/guardar-nota/SKILL.md`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
