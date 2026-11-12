---
id: 20261009-100000-feature-0012-cancelled-report
feature: 0012
title: Plan de implementación — Informe de canceladas
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Informe de canceladas

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: el comando `informe`.

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

### Task 1 — Comando `informe`

**Tras**: —
**Tests RED**: hilo principal · `test/informe.test.js`
**Superficies**: backend
**Verificación**: `node --test test/informe.test.js`
**Interfaces**:
- Consume: el array `bookings` de `src/app.js` (`{ room, day, slot, status, reason }`).
- Produce: `run('informe', [])` → texto con una línea por sala (`Norte: 2 canceladas`), una por cancelada (`  lun 10:00-12:00 — sala ocupada`) y `Total: <n> canceladas`.
**Ficheros**: `src/app.js`, `test/informe.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
