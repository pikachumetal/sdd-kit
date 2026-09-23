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

- `src/app.js` — valida la franja en `libres` y `reservar` con `isValidSlot` antes de consultar o reservar; si no cumple `HH:MM-HH:MM` (horas 00–23, minutos 00–59) devuelve el mensaje de error y corta el flujo.
- `src/slots.js` — corrige la validación de la hora 24 (`24:00-24:30` debe rechazarse).
- `test/app.test.js` — tests de franja mal formada en `libres` y `reservar`, y de la hora 24.
- Commit: `eee39ba` — feat: validar el formato de la franja horaria.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- `src/slots.js` sí se tocó, pese a que el plan lo marcaba como fuera de scope (compartido con la task 0008, en otro worktree). El dev-lead autorizó el 2026-09-21 corregir aquí la hora 24; la task 0008 integra el cambio al fusionar.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 verde (ver 4.2).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «se prueba en uso» · disparador: próximo uso real de `libres`/`reservar` en producción, a cargo de dev-lead (trigger concretado por el agente: la frase del dev-lead no lo nombraba).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |
| 5 | `node --test` | 6/6 pass ✔ |

### 4.3 Residuales / deuda generada

- Ninguna. La spec excluye validar que el inicio sea anterior al fin (fuera de scope, no es deuda).

## 5. Aprendizajes

- Dos tasks concurrentes en worktrees distintos pueden necesitar tocar el mismo fichero compartido (`src/slots.js`, task 0009 y 0008); sin autorización explícita del dev-lead por task, el solape se detecta tarde. → `tech-stack.md` (nota de coordinación en worktrees).

## 6. Adendas

- _Ninguna._
