---
id: 20260921-090000-task-0009-slot-format
task: 0009
title: Walkthrough — Validar el formato de la franja horaria
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Validar el formato de la franja horaria

## 1. Cambios realizados

- `src/slots.js` (nuevo) — `isValidSlot`, valida `HH:MM-HH:MM` con horas 00–23 y minutos 00–59.
- `src/app.js` — `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje único de error.
- `test/app.test.js` — tests de la validación (franja mal formada en `libres` y `reservar`, hora 24).
- Commit: `8aa8bad` (feat: validar el formato de la franja horaria).

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md` (módulo de estimación inactivo).

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 pass (incluye las 3 nuevas de esta task).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · «Lo he probado yo: `node src/app.js libres 10-12` da el mensaje de error y `node src/app.js libres 10:00-12:00` da Sur. Funciona.»

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` (mal formada) | mensaje de error ✔ (verificado por el agente en el smoke del plan) |
| 2 | `node src/app.js libres 24:00-24:30` (hora fuera de rango) | mensaje de error ✔ (verificado por el agente en el smoke del plan) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` (mal formada) | mensaje de error ✔ (verificado por el agente en el smoke del plan) |
| 4 | `node src/app.js libres 10:00-12:00` (válida) | `Sur` ✔ (verificado por el agente y por el dev-lead) |

### 4.3 Residuales / deuda generada

- Ninguna. Fuera de scope explícito: validar que el inicio sea anterior al fin (no entra en esta task, no se ha abierto deuda porque no estaba prometido).

## 5. Aprendizajes

- `app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js` y un comando nuevo que reciba una franja debe reusar `isValidSlot` → volcado a [architecture.md](../../architecture.md) (documento creado en este cierre, estaba pospuesto desde el init).

## 6. Adendas

- _Ninguna._
