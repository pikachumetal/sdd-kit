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

- `src/slots.js` (nuevo): `isValidSlot`, valida el formato `HH:MM-HH:MM` con horas 00–23 y minutos 00–59.
- `src/app.js`: `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; si no es válida, devuelven `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`
- `test/app.test.js`: tests de la validación.
- Commit: `350b5a2` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test`: verde (6/6), según `review.md`.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · «Lo he probado yo: `node src/app.js libres 10-12` da el mensaje de error y `node src/app.js libres 10:00-12:00` da Sur. Funciona.»

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (smoke previo del agente, plan.md) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (smoke previo del agente, plan.md) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |

### 4.3 Residuales / deuda generada

- Ninguna. La fila de deuda técnica "Sin validación del formato de franja horaria" del roadmap queda resuelta por esta task.

## 5. Aprendizajes

- `app.js` deja de ser el único fichero de código; el parseo de franjas vive en `src/slots.js` y cualquier comando nuevo que reciba una franja debe importarlo → `architecture.md` (creado).
- No hay skills de proyecto que reflejen o contradigan este cambio → revisión de skills: no aplica (`.claude/skills/` está vacío).

## 6. Adendas

- _Ninguna._
