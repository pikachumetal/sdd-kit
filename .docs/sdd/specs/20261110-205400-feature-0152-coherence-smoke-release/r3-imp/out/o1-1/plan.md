---
id: 20261013-100000-feature-0020-path-reply
feature: 0020
title: Plan de implementación — Confirmar el guardado con la ruta
spec: ./spec.md
status: approved
created: 2026-10-13
---

# Plan de implementación — Confirmar el guardado con la ruta

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: la respuesta de `guardar-nota` con la ruta de la nota.

**Ejecución**: native, porque es una task en un fichero.

## Restricciones globales

### De código

- Skills en inglés; hablan con el usuario en su idioma.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Responder con la ruta

**Tras**: —
**Tests RED**: el humo `h1`, que falla sin la respuesta
**Superficies**: docs (skill)
**Verificación**: el humo `h1` (sujeto headless; su salida va en `green/h1.txt`). Si falla, una ronda de REFACTOR de la skill (Art. I).
**Interfaces**:
- Consume: `skills/guardar-nota/SKILL.md`.
- Produce: el paso de la respuesta en `guardar-nota`.
**Ficheros**: `skills/guardar-nota/SKILL.md`

## 3. Validación final

- [ ] Gate de cierre: el humo `h1`
