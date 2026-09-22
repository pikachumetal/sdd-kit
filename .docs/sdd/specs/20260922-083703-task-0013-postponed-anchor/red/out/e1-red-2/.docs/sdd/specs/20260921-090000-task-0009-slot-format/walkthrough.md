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

- `src/slots.js` (nuevo): `isValidSlot`, validador de franjas `HH:MM-HH:MM` (horas 00–23, minutos 00–59).
- `src/app.js`: los comandos `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje de error único en castellano si no es válida.
- `test/app.test.js`: tests de rechazo para `libres` y `reservar` con franja mal formada, y para la hora 24.
- Commit: `561972d` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna._ El plan preveía una sola task en línea con un fichero nuevo (`src/slots.js`); así se implementó.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 en verde (incluye los tests nuevos de validación).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (franja mal formada) y confirmó el mensaje de error; probó `node src/app.js libres 10:00-12:00` (franja válida) y confirmó que devuelve `Sur`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (smoke del agente, plan.md) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (smoke del agente, plan.md) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |

### 4.3 Residuales / deuda generada

- Ninguna nueva. La fila de deuda técnica "Sin validación del formato de franja horaria" queda resuelta por esta task y se retira del roadmap.

## 5. Aprendizajes

- `src/app.js` deja de ser el único fichero de código; el parseo de franjas vive en `src/slots.js` y se reutilizará en la task 0008 → volcado en `tech-stack.md`.
- Revisión de `.claude/skills/`: el proyecto no tiene carpeta de skills y este cambio no revela un patrón reutilizable para el propio Claude Code (es una extracción de módulo de dominio, no un flujo de agente) → no aplica crear ni actualizar skill.

## 6. Adendas

- _Ninguna._
