---
id: 20260921-090000-task-0009-slot-format
task: 0009
title: Walkthrough — Validar el formato de la franja horaria
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Validar el formato de la franja horaria

## 1. Cambios realizados

- `src/slots.js` (nuevo): `isValidSlot(slot)` — regex `HH:MM-HH:MM`, horas `00`–`23`, minutos `00`–`59`.
- `src/app.js`: `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje único de error (`invalidSlot`).
- `test/app.test.js`: 3 tests nuevos — franja corta (`10-12`), hora sin ceros (`9:00-11:00`), hora 24 (`24:00-24:30`).
- Commit: `94841c8` — feat: validar el formato de la franja horaria.

## 2. Tiempo y coste: estimado vs real

- No aplica — no existe `.docs/sdd/estimation.md` en el proyecto.

## 3. Desviaciones del plan

- El plan marcaba `src/slots.js` como «NO se tocan» (lo comparte la reescritura de informes de la task 0008, en otro worktree). El dev-lead autorizó el 2026-09-21 tocarlo para corregir la hora 24; la task 0008 integra el cambio al fusionar. Registrado también en `plan.md`.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 verde (`review.md`).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «se prueba en uso» · disparador: la primera vez que se use `libres`/`reservar` en el día a día, a cargo de Àngel Delgado (dev-lead). *(Disparador concretado por el agente: la frase original no nombraba uno — corrígelo si no es el que querías.)*

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ (verificado por el agente) |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (verificado por el agente) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (verificado por el agente) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (verificado por el agente) |

### 4.3 Residuales / deuda generada

- Ninguna nueva. Esta task salda la fila de deuda técnica «Sin validación del formato de franja horaria» del roadmap.

## 5. Aprendizajes

- Delta de comportamiento (capacidad `room-booking`, ADDED "Una franja mal formada se rechaza") → `.docs/sdd/capabilities/room-booking.md`. El fichero no existía en el proyecto: creado desde `capability-template.md`.
- `.claude/skills/` no existe en el proyecto. Revisado: este cambio (una función de validación y su uso en dos comandos) no revela un patrón reutilizable nuevo ni desmiente nada existente — no se crea skill.

## 6. Adendas

- _Ninguna todavía._
