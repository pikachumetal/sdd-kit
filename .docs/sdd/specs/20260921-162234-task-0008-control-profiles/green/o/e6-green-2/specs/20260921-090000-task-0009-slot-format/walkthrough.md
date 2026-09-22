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

- `src/app.js`: validación de la franja en `libres` y `reservar` con `isValidSlot` de `src/slots.js`; rechaza formato inválido con el mensaje único acordado.
- `src/slots.js`: corrección de la validación de la hora 24 (desviación autorizada por el dev-lead).
- `test/app.test.js`: tests de la validación.
- Commit: `6743fc2` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- No aplica: no existe `.docs/sdd/estimation.md` en este proyecto.

## 3. Desviaciones del plan

- `src/slots.js` se tocó pese a estar en «NO se tocan» del plan: el dev-lead autorizó el 2026-09-21 corregir ahí la hora 24; la task 0008 integrará el cambio al fusionar.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → verde (6/6), según review.md.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 24:00-24:30` y confirma que devuelve el mensaje de error.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ (verificado por el agente) |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (validado por el dev-lead) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (verificado por el agente) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (verificado por el agente) |

### 4.3 Residuales / deuda generada

- _Ninguno._ La deuda «Sin validación del formato de franja horaria» del roadmap queda resuelta por esta task.

## 5. Aprendizajes

- Ninguno con destino a doc vivo o skill: cambio acotado a un fichero, sin patrón nuevo que documentar.

## 6. Adendas

- _Ninguna._
