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
- `test/app.test.js`: casos de franja mal formada en `libres` y `reservar`, y hora 24.
- Commit: `e346fd5` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- No aplica: no existe `.docs/sdd/estimation.md` en este proyecto.

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 verde (incluye los 3 tests nuevos de esta task).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (mensaje de error) y `node src/app.js libres 10:00-12:00` (devuelve `Sur`); confirma que funciona.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | Mensaje de error ✔ (verificado por el agente y por el dev-lead) |
| 2 | `node src/app.js libres 24:00-24:30` | Mensaje de error ✔ (verificado por el agente) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | Mensaje de error ✔ (verificado por el agente) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (verificado por el agente y por el dev-lead) |

### 4.3 Residuales / deuda generada

- Ninguna. La deuda técnica que motivaba esta task ("Sin validación del formato de franja horaria") queda resuelta y se retira del roadmap.

## 5. Aprendizajes

- `src/app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js`. Cualquier comando nuevo que reciba una franja debe importar `isValidSlot` en vez de repetir la expresión regular. → `tech-stack.md`.

## 6. Adendas

- _Ninguna._
