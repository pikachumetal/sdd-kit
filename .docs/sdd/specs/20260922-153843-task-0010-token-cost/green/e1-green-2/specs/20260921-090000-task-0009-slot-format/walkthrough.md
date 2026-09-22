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

- `src/slots.js` (nuevo) — `isValidSlot`, parser estricto `HH:MM-HH:MM` con horas 00–23 y minutos 00–59.
- `src/app.js` — `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje único de error.
- `test/app.test.js` — tests de la validación en `libres` y `reservar`, y del caso límite hora 24.
- Commit: `f73d50c` — feat: validar el formato de la franja horaria.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 1,5h — sin desviación relevante reportada por el dev-lead.
- Desviación: 0h (0%)
- Causa de la desviación: no aplica.
- Modelo del hilo: Sonnet 5
- Tokens del hilo: no medido
- Tokens de subagentes: 214k en implementador (Sonnet high, 13 min) + 128k en revisor de task (Sonnet medium, 7 min) + 131k en revisor final (Sonnet medium, 8 min)
- Coste de sujetos: 1,85 $ en 4 sujetos Sonnet — smoke de mensajes de error con `claude -p` como usuario nuevo
- Review de spec: no

## 3. Desviaciones del plan

- _Ninguna._

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 tests en verde.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (mensaje de error) y `node src/app.js libres 10:00-12:00` (`Sur`); confirma que funciona.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ (verificado por el dev-lead) |
| 2 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (verificado por el dev-lead) |
| 3 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (smoke del plan) |
| 4 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (smoke del plan) |

### 4.3 Residuales / deuda generada

- _Ninguna._

## 5. Aprendizajes

- `app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js`, reutilizable por la task 0008. → `tech-stack.md` (estructura de ficheros).

## 6. Adendas

- _Ninguna._
