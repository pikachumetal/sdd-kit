---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-10-08
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Dos tasks, SDD.

**Goal**: cancelar con motivo y listar las canceladas.

**Ejecución**: subagent, porque se quiere revisión por task.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.

### De proceso

- SDD: un implementador por task y su revisión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — Cancelar con motivo

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Ficheros**: `src/app.js`, `test/cancel.test.js`

### Task 2 — Listado de canceladas

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Ficheros**: `src/app.js`, `test/cancel.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
