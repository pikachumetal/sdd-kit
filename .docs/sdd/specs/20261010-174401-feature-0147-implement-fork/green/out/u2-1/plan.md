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

1. Dos tasks, Native. (Enmienda 2026-10-10: una tercera task, `--por`, ejecutada antes de la 2.)

**Goal**: cancelar con motivo y listar las canceladas.

**Ejecución**: native, porque son tres tasks cortas en el mismo fichero.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.

### De proceso

- Native: implementa la sesión.

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

### Task 3 — enmienda 2026-10-10: `--por <nombre>` en `cancelar`

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Ficheros**: `src/app.js`, `test/cancel.test.js`
**Orden**: se ejecuta antes de la Task 2, que lista lo que esta guarda.

## 3. Validación final

- [ ] Gate de cierre: `node --test`
