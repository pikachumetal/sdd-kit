---
id: 20261020-100000-feature-0037-note-tags-smoke
feature: 0037
title: Plan de implementación — Etiquetas al guardar una nota
spec: ./spec.md
status: approved
created: 2026-10-20
---

# Plan de implementación — Etiquetas al guardar una nota

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: el paso 4 de `guardar-nota`, con sus tres humos.

**Ejecución**: native, porque es una task en un fichero.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; skills en inglés.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Etiquetas al guardar una nota

**Tras**: —
**Tests RED**: los humos `h1`, `h2` y `h3`, con un sujeto headless cada uno
**Superficies**: docs (skill)
**Verificación**: `SCENARIOS="h1 h2 h3" node scripts/humo.mjs` → una línea `<id>: verde` por humo, y su `green/<id>.txt`
**Interfaces**:
- Consume: `skills/guardar-nota/SKILL.md`.
- Produce: el paso 4.
**Ficheros**: `skills/guardar-nota/SKILL.md`

- [ ] **Step 1**: añade el paso 4 a `skills/guardar-nota/SKILL.md`: «Ask the user for up to three tags and write them in a `tags:` line at the top of the note, in the order given.»
- [ ] **Step 2**: lanza los tres humos: `SCENARIOS="h1 h2 h3" node scripts/humo.mjs`. Esperado: `h1: verde`, `h2: verde`, `h3: verde`.
- [ ] **Step 3**: commit de la task.

## 3. Validación final

- [ ] Gate de cierre: `node --test`
