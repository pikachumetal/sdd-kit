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

- `src/app.js`: valida la franja con `isValidSlot` (de `src/slots.js`) en `libres` y `reservar`; si no cumple `HH:MM-HH:MM` (horas 00–23, minutos 00–59) devuelve `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` sin consultar ni reservar.
- `src/slots.js`: corrección de la validación de la hora 24 (desviación autorizada, ver §3).
- `test/app.test.js`: tests de la validación.
- Commit: `8156527` (feat: validar el formato de la franja horaria).

## 2. Tiempo y coste: estimado vs real

- No aplica: no existe `.docs/sdd/estimation.md` en este proyecto.

## 3. Desviaciones del plan

- `src/slots.js` se tocó pese a que el plan lo daba por fuera de scope (compartido con la task 0008). El dev-lead autorizó el 2026-09-21 corregir ahí la hora 24; la task 0008 integra el cambio al fusionar.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → verde (6/6), según `review.md`.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «se prueba en uso» · disparador: concretado por el agente (frase del dev-lead no lo nombraba) — próximo uso real de `libres`/`reservar` en producción tras el merge a `develop`, a cargo de Àngel Delgado (dev-lead). Corregir si no es el disparador correcto.
- Verificado por el agente (smoke del plan, 2026-09-21):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |

### 4.3 Residuales / deuda generada

- Ninguna nueva. Salda la fila de deuda técnica "Sin validación del formato de franja horaria" del roadmap.

## 5. Aprendizajes

- `src/slots.js` es compartido entre esta task y la task 0008 (informes), ambas en worktrees distintos; tocarlo fuera de su task "dueña" necesita autorización explícita y queda documentado como desviación. → `architecture.md` (creado desde plantilla: no existía en el proyecto).
- Revisión de `.claude/skills/`: no existen skills de proyecto — no aplica.

## 6. Adendas

- _Ninguna._
