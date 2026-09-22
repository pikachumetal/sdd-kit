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
- `src/app.js` — `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje de error único.
- `test/app.test.js` — tests de la validación.
- Commit: `8a737fb feat: validar el formato de la franja horaria`.

## 2. Tiempo: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,5h (implementador 13 min + revisor de task 7 min + revisor final 8 min, ver `tasks.md` y `review.md`)
- Desviación: -1h (-67%)
- Causa de la desviación: task acotada a un fichero nuevo (`slots.js`) sin dependencias ni ambigüedad de requisitos; el subagente no necesitó rondas extra de exploración.
- Review de spec: sin review — señales: ninguna.

## 3. Desviaciones del plan

- _Ninguna._

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 verde (ver `review.md`).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (da el mensaje de error) y `node src/app.js libres 10:00-12:00` (da `Sur`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ (dev-lead) |
| 2 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (dev-lead) |
| 3 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (agente, smoke previo en `plan.md`) |
| 4 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (agente, smoke previo en `plan.md`) |

### 4.3 Residuales / deuda generada

- _Ninguna._ La fila de deuda técnica «Sin validación del formato de franja horaria» del roadmap queda resuelta por esta task.

## 5. Aprendizajes

- `app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js` y `app.js` solo enruta comandos; un comando nuevo que reciba una franja debe importar `isValidSlot` en vez de repetir la expresión regular → `architecture.md` (creado desde plantilla en este cierre).

## 6. Adendas

- _Ninguna._
