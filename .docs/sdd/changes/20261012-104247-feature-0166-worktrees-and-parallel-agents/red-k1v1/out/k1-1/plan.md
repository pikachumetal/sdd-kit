---
id: 20261010-100000-feature-0018-help
feature: 0018
title: Plan de implementación — Comando de ayuda
spec: ./spec.md
status: approved
created: 2026-10-10
---

# Plan de implementación — Comando de ayuda

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: Comando `ayuda`.

**Ejecución**: native, porque es una task en un fichero.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Comando `ayuda`

**Tras**: —
**Tests RED**: hilo principal · `test/ayuda.test.js`
**Superficies**: backend
**Verificación**: `node --test test/ayuda.test.js`
**Interfaces**:
- Consume: `run(cmd, params)` de `src/app.js` y la sección «Comandos» de `README.md`.
- Produce: `run('ayuda', [])` → una línea `<comando>: <frase>` por comando.
**Ficheros**: `src/app.js`, `test/ayuda.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
