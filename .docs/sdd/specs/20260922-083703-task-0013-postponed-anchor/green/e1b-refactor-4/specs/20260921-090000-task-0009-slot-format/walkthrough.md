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

- `src/slots.js` — nuevo módulo con `isValidSlot`: parser/validador de franjas `HH:MM-HH:MM` (horas 00–23, minutos 00–59).
- `src/app.js` — `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; si no es válida, devuelven `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`
- `test/app.test.js` — 3 tests nuevos: franja sin ceros (`10-12`), franja con minutos sin normalizar (`9:00-11:00`) y hora fuera de rango (`24:00-24:30`).
- Commit: `5a84964` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md` (módulo de estimación no activado).

## 3. Desviaciones del plan

- _Ninguna._

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 verdes (incluye los 3 tests nuevos de la validación).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (mensaje de error) y `node src/app.js libres 10:00-12:00` (`Sur`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | Mensaje de error ✔ (validado por el dev-lead) |
| 2 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (validado por el dev-lead) |
| 3 | `node src/app.js libres 24:00-24:30` | Mensaje de error ✔ (smoke del agente, plan.md) |
| 4 | `node src/app.js reservar Norte 9:00-11:00` | Mensaje de error ✔ (smoke del agente, plan.md) |

### 4.3 Residuales / deuda generada

- Ninguno nuevo. La deuda "Sin validación del formato de franja horaria" del roadmap queda resuelta por esta task.

## 5. Aprendizajes

- `src/app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js`, `app.js` solo enruta comandos. Cualquier comando nuevo que reciba una franja debe importar `isValidSlot` en vez de repetir la expresión regular → `architecture.md` (creado desde plantilla, no existía).

## 6. Adendas

_Ninguna._
