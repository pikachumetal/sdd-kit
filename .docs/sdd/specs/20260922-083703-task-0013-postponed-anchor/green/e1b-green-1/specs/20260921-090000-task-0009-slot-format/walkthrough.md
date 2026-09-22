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

- `src/slots.js` (nuevo): `isValidSlot`, parser/validador de franjas `HH:MM-HH:MM` (horas 00–23, minutos 00–59).
- `src/app.js`: `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje único de error.
- `test/app.test.js`: tests de la validación (franja mal formada en `libres` y en `reservar`, hora 24).
- Commit: `c34bf1b feat: validar el formato de la franja horaria`.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 verdes (incluye los 3 tests nuevos de esta task).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (da el mensaje de error) y `node src/app.js libres 10:00-12:00` (da `Sur`). Coincide con el smoke del plan.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ |
| 2 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |
| 3 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (smoke agente, plan.md) |
| 4 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (smoke agente, plan.md) |

### 4.3 Residuales / deuda generada

- Ninguna. La deuda "Sin validación del formato de franja horaria" (roadmap.md) queda resuelta por esta task.

## 5. Aprendizajes

- El parseo de franjas deja de vivir en `app.js` y pasa a `src/slots.js`; cualquier comando nuevo que reciba una franja debe importar `isValidSlot` en vez de repetir la expresión regular → anotado en `review.md`; sin `architecture.md` en el proyecto, no hay otro doc vivo de estructura donde volcarlo.

## 6. Adendas

- _Ninguna._
