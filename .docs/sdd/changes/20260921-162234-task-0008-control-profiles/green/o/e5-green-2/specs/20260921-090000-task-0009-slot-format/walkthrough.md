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

- `src/app.js`: valida la franja con `isValidSlot` (de `src/slots.js`) en `libres` y `reservar`; rechaza con mensaje único en castellano.
- `src/slots.js`: corregido el límite de hora 24 (`24:00-24:30` ahora se rechaza).
- `test/app.test.js`: tests de la validación en ambos comandos.
- Commit: `cbbedc3` — feat: validar el formato de la franja horaria.

## 3. Desviaciones del plan

- `src/slots.js` se tocó pese a que el plan decía "NO se tocan": el dev-lead autorizó el 2026-09-21 corregir ahí el límite de hora 24; la task 0008 (en otro worktree, reescribiendo el módulo de informes que comparte `slots.js`) integra el cambio al fusionar.

### Decisiones tomadas sin el dev-lead

- _Ninguna_.

## 4. Verificación

### 4.1 Builds

- `node --test` → verde, 6/6.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «Lo pruebo mañana junto con la 0008» · disparador: prueba del dev-lead junto con el cierre de la task 0008.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |

### 4.3 Residuales / deuda generada

- Ninguna nueva; la deuda "sin validación del formato de franja horaria" del roadmap queda saldada por esta task.

## 5. Aprendizajes

- `src/slots.js` es compartido entre esta task y la 0008 (informes) en curso en otro worktree; cambios ahí necesitan coordinación explícita del dev-lead → sin destino a doc vivo (coordinación puntual entre worktrees, no una convención nueva).

## 6. Adendas

- _Ninguna todavía._
