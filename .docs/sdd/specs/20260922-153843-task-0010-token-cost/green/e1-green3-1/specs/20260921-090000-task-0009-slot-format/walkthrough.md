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

- `src/slots.js` (nuevo): `isValidSlot`, regex `HH:MM-HH:MM` con horas 00–23 y minutos 00–59.
- `src/app.js`: `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje único de error.
- `test/app.test.js`: tests de franja mal formada en `libres` y `reservar`, y de la hora 24.
- Commits: `aceeb87` (test), `f236799` (feat), `cf4f122` (docs sdd).

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 1,5h — sin desviación relevante sobre el reloj del hilo.
- Desviación: 0h (0%)
- Modelo del hilo: Sonnet 5
- Tokens del hilo: no medido
- Tokens de subagentes: 473k en 3 despachos — implementador Sonnet high 214k / 13min; revisor de task Sonnet medium 128k / 7min; revisor final Sonnet medium 131k / 8min
- Coste de sujetos: 1,85 $ en 4 sujetos Sonnet — smoke de mensajes de error con CLI headless, 1,85 $
- Review de spec: sin review

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 en verde (última ejecución en este cierre).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · `node src/app.js libres 10-12` da el mensaje de error; `node src/app.js libres 10:00-12:00` da `Sur`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ |
| 2 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |
| 3 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (smoke previo del plan) |
| 4 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (smoke previo del plan) |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- `src/app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js`, reutilizable por la task 0008. → `tech-stack.md` (actualizado en este cierre).
- Sin `.claude/skills/` en este proyecto: no aplica revisión de skills.

## 6. Adendas

- _Ninguna._
