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

- `src/slots.js` — nuevo módulo con `isValidSlot`, parser de franjas `HH:MM-HH:MM` (horas 00–23, minutos 00–59).
- `src/app.js` — `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje único de error.
- `test/app.test.js` — tests: `libres` y `reservar` rechazan franja mal formada, `libres` rechaza hora 24.
- Commit: `8aa8bad` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test` → 6 tests, 6 pass, 0 fail.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (mensaje de error) y `node src/app.js libres 10:00-12:00` (`Sur`); confirma que funciona.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | Mensaje de error ✔ |
| 2 | `node src/app.js libres 24:00-24:30` | Mensaje de error ✔ |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | Mensaje de error ✔ |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ |

### 4.3 Residuales / deuda generada

- Ninguna: cierra la deuda técnica "Sin validación del formato de franja horaria" registrada en el roadmap.

## 5. Aprendizajes

- Cambio de comportamiento observable (franja mal formada se rechaza) → queda documentado en el delta de `spec.md`; el proyecto no usa `capabilities/` (no existe en tasks previas 0005/0006), así que no se crea ese directorio ad hoc para esta task.
- Ningún patrón nuevo reutilizable ni skill desmentida: `.claude/skills/` sigue vacío, no aplica crear ni actualizar skill.

## 6. Adendas

- _Ninguna._
