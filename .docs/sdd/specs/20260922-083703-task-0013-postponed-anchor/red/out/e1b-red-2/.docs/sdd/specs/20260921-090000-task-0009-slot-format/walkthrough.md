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
- `src/app.js`: valida la franja en `libres` y `reservar` con `isValidSlot`; si no es válida, devuelve `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` y no consulta ni reserva.
- `test/app.test.js`: tests de rechazo de franja mal formada en `libres` y `reservar`, y del caso límite hora 24.
- Commit: `350b5a2` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 pass (0 fail).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (da el mensaje de error) y `node src/app.js libres 10:00-12:00` (da `Sur`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ (verificado por el dev-lead) |
| 2 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (verificado por el dev-lead) |
| 3 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (smoke del agente, plan.md) |
| 4 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (smoke del agente, plan.md) |

### 4.3 Residuales / deuda generada

- Ninguna. La deuda técnica "Sin validación del formato de franja horaria" del roadmap queda resuelta por esta task.

## 5. Aprendizajes

- `src/app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js`. Cualquier comando nuevo que reciba una franja debe importar `isValidSlot` en vez de repetir la expresión regular → anotado en `review.md`; próxima task que toque franjas (0008, avisos por correo) debe reusar `isValidSlot`.

## 6. Adendas

