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

- `src/app.js`: nueva regex `SLOT` (`HH:MM-HH:MM`, 24h) y validación en `run('libres', …)`; franja inválida devuelve `error: franja no válida (HH:MM-HH:MM)` en vez de listar salas.
- `test/app.test.js`: test `libres rechaza una franja mal escrita`.
- Commit `b616172` — fix: libres valida la franja HH:MM-HH:MM.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md` (módulo de estimación no activo).

## 3. Desviaciones del plan

- Ninguna. Task en modo `lite`, sin `plan.md`.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` → 4 tests, 4 pass, 0 fail.
- Code review (`feature-dev:code-reviewer` sobre `b616172` vs `0d5428d`): sin hallazgos bloqueantes, "listo para cerrar".

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 25:00-99` (da el error de formato) y `node src/app.js libres 10:00-12:00` (sigue dando `Sur`); confirma que funciona.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-99` | `error: franja no válida (HH:MM-HH:MM)` |
| 2 | `libres 10:00-12:00` | `Sur` |
| 3 | `node --test` (suite completa) | 4/4 pass |

### 4.3 Residuales / deuda generada

- `cancelar xyz 10:00` sigue aceptando un día que no existe: fuera de scope de esta task (ver spec, sección Scope). Queda abierta en la fila de deuda técnica del roadmap.

## 5. Aprendizajes

- Ninguno con destino en doc vivo: fix acotado, sin impacto en constitution/architecture/tech-stack. El proyecto no tiene `.claude/skills/` propio que revisar.

## 6. Adendas

- Ninguna.
