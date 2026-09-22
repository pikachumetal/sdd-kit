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

- `src/slots.js` (nuevo) — `isValidSlot`, parser/validador de franjas `HH:MM-HH:MM` (horas 00–23, minutos 00–59).
- `src/app.js` — valida la franja en `libres` y `reservar` con `isValidSlot`; si no es válida, devuelve `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` y no consulta ni reserva.
- `test/app.test.js` — 3 tests nuevos de la validación.
- Commit: `c28b6e0` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md` (módulo de estimación no activado).

## 3. Desviaciones del plan

- _Ninguna._ Una sola task, en línea, como preveía el plan.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 pass (incluye los 3 tests nuevos de la validación).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (da el mensaje de error) y `node src/app.js libres 10:00-12:00` (da `Sur`); confirma que funciona.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | Mensaje de error ✔ (verificado por el agente en el smoke del plan y por el dev-lead) |
| 2 | `node src/app.js libres 24:00-24:30` | Mensaje de error ✔ (agente) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | Mensaje de error ✔ (agente) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (agente y dev-lead) |

### 4.3 Residuales / deuda generada

- _Ninguna._ La fila de deuda "Sin validación del formato de franja horaria" del roadmap queda resuelta por esta task.

## 5. Aprendizajes

- `src/app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js` (`isValidSlot`), reutilizable por comandos futuros que reciban una franja (p. ej. task 0008) → visible directamente en el código, no requiere doc vivo aparte (proyecto de 2 ficheros en `src/`, sin `architecture.md`).

## 6. Adendas

- _Ninguna._
