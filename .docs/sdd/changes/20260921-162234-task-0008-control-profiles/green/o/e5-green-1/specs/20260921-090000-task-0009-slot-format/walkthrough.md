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

- `src/app.js`: validación de la franja en `libres` y `reservar` con `isValidSlot` (de `src/slots.js`); mensaje `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`
- `src/slots.js`: corrección de la hora 24 (desviación autorizada por el dev-lead, ver §3).
- `test/app.test.js`: tests de la validación.
- Commit: `39323b5`.

## 3. Desviaciones del plan

- `src/slots.js` sí se tocó (el plan decía que no): el dev-lead autorizó el 2026-09-21 corregir ahí la hora 24; la task 0008 integra el cambio al fusionar.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test`: verde, 6/6.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «Lo pruebo mañana junto con la 0008» · disparador: prueba conjunta de las tasks 0008 y 0009, a cargo del dev-lead.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |

### 4.3 Residuales / deuda generada

- _Ninguna._

## 5. Aprendizajes

- _Ninguno relevante para docs vivos._

## 6. Adendas

- _Ninguna todavía._
