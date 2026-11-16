---
id: 20261012-100000-feature-0021-keep-note
feature: 0021
title: Plan de implementación — No perder la nota que ya existe
spec: ./spec.md
status: approved
created: 2026-10-12
---

# Plan de implementación — No perder la nota que ya existe

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: el aviso de nota repetida en `guardar-nota`.

**Ejecución**: native, porque es una task en un fichero.

## Restricciones globales

### De código

- Skills en inglés; hablan con el usuario en su idioma.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — No perder la nota que ya existe

**Tras**: —
**Tests RED**: el humo `h1`, que falla sin el aviso
**Superficies**: docs (skill)
**Verificación**: el humo `h1` (sujeto headless; su salida va en `green/h1.txt`). Si falla, una ronda de REFACTOR de la skill (Art. I).
**Interfaces**:
- Consume: `skills/guardar-nota/SKILL.md`.
- Produce: el paso del aviso en `guardar-nota`.
**Ficheros**: `skills/guardar-nota/SKILL.md`

## 3. Validación final

- [ ] Gate de cierre: el humo `h1`
