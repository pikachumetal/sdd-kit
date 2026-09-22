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

- `src/slots.js` (nuevo): `isValidSlot`, regex `HH:MM-HH:MM` con horas 00-23 y minutos 00-59.
- `src/app.js`: `libres` y `reservar` rechazan franja inválida con el mensaje único; importa `isValidSlot`.
- `test/app.test.js`: 3 tests nuevos (franja corta, franja inválida en `reservar`, hora 24).
- Commit: `bd64f55` feat: validar el formato de la franja horaria.

## 3. Desviaciones del plan

- El plan decía "NO se tocan: `src/slots.js`" (se asumía compartido con la task 0008, en otro worktree). En esta rama el fichero no existía todavía y se creó aquí. El dev-lead autorizó el 2026-09-21 incluir en él la corrección de la hora 24; la task 0008 deberá resolver/integrar el fichero al fusionar.

### Decisiones tomadas sin el dev-lead

- _Ninguna_.

## 4. Verificación

### 4.1 Builds

- `node --test`: 6/6 en verde (`review.md`).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 24:00-24:30` y confirmó el mensaje de error.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 10-12` | mensaje de error ✔ |
| 2 | `libres 24:00-24:30` | mensaje de error ✔ (validado por el dev-lead) |
| 3 | `reservar Norte 9:00-11:00` | mensaje de error ✔ |
| 4 | `libres 10:00-12:00` | `Sur` ✔ |

### 4.3 Residuales / deuda generada

- Coordinación de `src/slots.js` con la task 0008 al fusionar (mismo fichero en dos ramas paralelas).

## 5. Aprendizajes

- El plan asumió que `src/slots.js` ya existía en la rama compartida; en worktrees paralelos desde `develop`, un fichero "no tocar" puede no existir aún en la rama propia → anotado como deuda en el roadmap (riesgo de conflicto con la task 0008).

## 6. Adendas

- _Ninguna_.
