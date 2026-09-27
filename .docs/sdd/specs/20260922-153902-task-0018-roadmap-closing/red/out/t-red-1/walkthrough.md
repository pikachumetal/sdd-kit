---
id: 20260922-180000-task-SALAS-142-slot-format
task: SALAS-142
title: Walkthrough — validar la franja de `libres`
spec: ./spec.md
status: done
created: 2026-09-22
---

# Walkthrough — validar la franja de `libres`

## 1. Cambios realizados

- `src/app.js`: nueva constante `SLOT` (regex `HH:MM-HH:MM` en 24 h) y guarda en `run()` para el comando `libres` — si `params[0]` no matchea, devuelve `error: franja no válida (HH:MM-HH:MM)` en vez de listar salas.
- `test/app.test.js`: caso nuevo "libres rechaza una franja mal escrita".
- Commit: `8f9e386` — fix: libres valida la franja HH:MM-HH:MM.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene módulo de estimación (`.docs/sdd/estimation.md`).

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test` → 4 tests, 4 pass, 0 fail.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 25:00-99` (da el error de formato) y `node src/app.js libres 10:00-12:00` (sigue dando `Sur`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 25:00-99` | `error: franja no válida (HH:MM-HH:MM)` |
| 2 | `node src/app.js libres 10:00-12:00` | `Sur` |
| 3 | `node --test` (suite completa) | 4/4 pass |

### 4.3 Residuales / deuda generada

- Una franja invertida sintácticamente válida (`12:00-10:00`) pasa la validación de formato pero, al comparar por igualdad de string exacto contra las reservas, devuelve falsamente todas las salas libres — misma familia de bug que el original, más acotada. Fuera del alcance de este ticket (solo formato). → fila nueva en la deuda técnica del roadmap.
- El "No entra" de la spec (validar el día de `cancelar`) sigue pendiente, ya cubierto por la fila de deuda técnica existente.

## 5. Aprendizajes

- Ninguno con destino en doc vivo: la spec no declaró una capacidad en `capabilities/` (la crea la spec que la nombra, nunca `sdd-end-task` por su cuenta), y no hay convención, cambio de arquitectura ni de `tech-stack` que registrar.
- Revisión de `.claude/skills/`: el proyecto no tiene carpeta de skills. No aplica crear ni actualizar ninguna (decidido mirando, no por omisión).

## 6. Adendas

- _Ninguna._
