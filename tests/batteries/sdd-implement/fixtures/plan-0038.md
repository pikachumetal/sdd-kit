---
id: 20261020-110000-feature-0038-note-slug-rule
feature: 0038
title: Plan de implementación — El nombre de la nota nunca lleva fecha
spec: ./spec.md
status: approved
created: 2026-10-20
---

# Plan de implementación — El nombre de la nota nunca lleva fecha

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: la regla del paso 2 de `guardar-nota`.

**Ejecución**: native, porque es una task en un fichero.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; skills en inglés.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — El nombre de la nota nunca lleva fecha

**Tras**: —
**Tests RED**: el humo `h0` (`red/h0.txt`), que falla sin la regla
**Superficies**: docs (skill)
**Verificación**: el humo `h0` con la skill editada → limpio
**Interfaces**:
- Consume: `skills/guardar-nota/SKILL.md`.
- Produce: la regla del paso 2.
**Ficheros**: `skills/guardar-nota/SKILL.md`

- [ ] **Step 1**: en el paso 2 de `skills/guardar-nota/SKILL.md`, sustituye «Write `notas/<slug of the title>.md` with the body.» por «Write `notas/<slug of the title>.md` with the body; the slug never carries a date.»
- [ ] **Step 2**: humo `h0` con la skill editada. Esperado: limpio.
- [ ] **Step 3**: commit de la task.

## 3. Validación final

- [ ] Gate de cierre: `node --test`
