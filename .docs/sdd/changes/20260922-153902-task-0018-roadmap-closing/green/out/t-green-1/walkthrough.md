---
id: 20260919-090000-task-SALAS-142-slot-format
task: SALAS-142
title: Walkthrough — validar la franja de `libres`
spec: ./spec.md
status: done
created: 2026-09-22
---

# Walkthrough — validar la franja de `libres`

## 1. Cambios realizados

- `src/app.js`: constante `SLOT` (regex `^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$`) y guarda en `run()` para el comando `libres`: si `params[0]` no matchea, devuelve `error: franja no válida (HH:MM-HH:MM)` en vez de listar salas. El fix vive en el único punto de entrada de `libres` (`run()`), no en un parche del caso reportado.
- `test/app.test.js`: test nuevo `libres rechaza una franja mal escrita`.
- Commit: `44feebe` — fix: libres valida la franja HH:MM-HH:MM.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna._ Modo lite (sin `plan.md`); el fix cierra los dos escenarios de la spec tal cual estaban escritos.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` → 4/4 en verde (incluye el test nuevo y los 3 preexistentes).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · ejecutó `node src/app.js libres 25:00-99` (da el error de formato) y `node src/app.js libres 10:00-12:00` (sigue dando `Sur`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-99` | `error: franja no válida (HH:MM-HH:MM)` |
| 2 | `libres 10:00-12:00` | `Sur` |

### 4.3 Residuales / deuda generada

- Validar el día de `cancelar` queda fuera de scope (otro ticket) — la fila de deuda técnica del roadmap queda **parcial**.
- El cambio de comportamiento de `libres` es observable y candidato a `capabilities/`, pero `spec.md` no declaró una capacidad nueva en «Decisiones que he tomado yo» — por la regla del propio `capability-template.md` ("la crea la spec que la declara; nunca la crea `sdd-end-task` por su cuenta"), no se crea aquí. Se anota como fila nueva de deuda técnica.

## 5. Aprendizajes

- Comportamiento observable nuevo de `libres` (valida franja, error de formato) → sin destino: `capabilities/` no existe y la spec no lo declaró. Anotado como deuda técnica en el roadmap en vez de inventar el documento.
- Revisión de skills: `.claude/skills/` no existe en este proyecto. El fix es puntual (una regex + una guarda) y no revela un patrón reutilizable ni desmiente nada — no aplica, mirado.

## 6. Adendas

- _Ninguna._
