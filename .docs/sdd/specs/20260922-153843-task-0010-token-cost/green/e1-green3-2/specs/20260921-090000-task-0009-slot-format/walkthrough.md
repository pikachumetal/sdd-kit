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

- `src/slots.js` (nuevo) — `isValidSlot`, regex `HH:MM-HH:MM` con horas 00–23 y minutos 00–59. Commit `f236799`.
- `src/app.js` — `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje único de error. Commit `f236799`.
- `test/app.test.js` — 3 tests nuevos: franja sin dos puntos, hora de un dígito, hora 24. Commit `aceeb87`.
- `.docs/sdd/specs/20260921-090000-task-0009-slot-format/{spec,plan,tasks,review}.md` — documentación de la task. Commit `cf4f122`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 1,05h — aproximado por marcas de commits (no hay reloj de hilo exacto): `aceeb87` 10:05 → `cf4f122` 11:08 (63 min).
- Desviación: -0,45h (-30%)
- Modelo del hilo: no medido
- Tokens del hilo: no medido
- Tokens de subagentes: 342k en 2 despachos — Implementador Sonnet high 214k / 13 min; Revisor de task Sonnet medium 128k / 7 min
- Coste de sujetos: 1,85 $ en 4 sujetos Sonnet — smoke headless post-cierre 1,85 $
- Review de spec: no

## 3. Desviaciones del plan

- _Ninguna._ El Step 4 del plan («presentar al dev-lead para validar») quedaba pendiente; se completa con la validación de este cierre.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 verde.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · «`node src/app.js libres 10-12` da el mensaje de error y `node src/app.js libres 10:00-12:00` da Sur. Funciona.»

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ (dev-lead) |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (smoke plan) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (smoke plan) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (dev-lead) |

### 4.3 Residuales / deuda generada

- Fuera de scope (spec, sección Scope): validar que el inicio de la franja sea anterior al fin → fila de deuda técnica en `roadmap.md`.

## 5. Aprendizajes

- `app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js` y cualquier comando nuevo que reciba una franja debe importar `isValidSlot` en vez de repetir la expresión regular → `architecture.md` (creado desde plantilla, no existía).
- La descripción "Un solo fichero de entrada: `src/app.js`" de `tech-stack.md` quedó desactualizada por el punto anterior → corregida en `tech-stack.md`.
- Revisión de skills: `.claude/skills/` no existe en el proyecto; esta task es lógica de aplicación puntual, no revela un patrón reutilizable a nivel skill → no aplica.

## 6. Adendas

- _Ninguna._
