---
id: 20261009-130000-feature-0015-report-groupings
feature: 0015
title: Plan de implementación — Informe por sala y por motivo
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Informe por sala y por motivo

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
- Consume: el array `bookings` de `src/app.js` (`{ room, day, slot, status, reason, owner }`), `rooms`, `reasons` y `week`.
- Produce: `run('informe', ['--por', 'sala' | 'motivo'])` → una línea por grupo (`Norte: 2 canceladas`; `sala ocupada: 2 canceladas`), una por cancelada (por sala: `  mié 12:00-13:00 — otro (Ana)`; por motivo: `  Sur jue 16:00-17:00 (Luis)`) y `Total: <n> canceladas`; sin `--por`, `uso: informe --por sala|motivo`. Los grupos van en orden alfabético de sala o en el orden de `reasons`; dentro, por sala y día de la semana.
**Ficheros**: `src/app.js`, `test/informe.test.js`

## 3. Validación final

- [ ] Gate de cierre: `node --test`
