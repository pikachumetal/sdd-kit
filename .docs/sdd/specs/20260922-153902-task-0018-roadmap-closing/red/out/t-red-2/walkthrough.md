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

- `src/app.js`: nueva regex `SLOT` (`HH:MM-HH:MM`, 24h) y validación en el comando `libres`; si la franja no cumple el formato, responde `error: franja no válida (HH:MM-HH:MM)` en vez de listar salas.
- `test/app.test.js`: test nuevo que cubre el rechazo de una franja mal escrita.
- Commit: `d39c467` — fix: libres valida la franja HH:MM-HH:MM.

## 2. Tiempo: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md` (módulo de estimación no activo).

## 3. Desviaciones del plan

- Modo lite, sin `plan.md`. La implementación sigue el intent y los dos escenarios de la spec sin desviaciones.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 4 tests, 4 pass, 0 fail (ejecutado en el cierre).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó manualmente `node src/app.js libres 25:00-99` (da error de formato) y `node src/app.js libres 10:00-12:00` (sigue devolviendo `Sur`). Reproducido también por el agente con el mismo resultado.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-99` | `error: franja no válida (HH:MM-HH:MM)` |
| 2 | `libres 10:00-12:00` | `Sur` |
| 3 | test unitario `libres rechaza una franja mal escrita` | pass |

### 4.3 Residuales / deuda generada

- Validar el día de `cancelar` (p. ej. `cancelar xyz 10:00` acepta un día que no existe) queda fuera de scope de este ticket. Se mantiene como fila de deuda técnica separada en el roadmap.
- Code review (`superpowers:requesting-code-review`, diff `5facd00..d39c467`): sin hallazgos Critical. Important no bloqueantes: el test nuevo solo comprueba el prefijo del mensaje de error (no el sufijo `(HH:MM-HH:MM)`) y falta un test para `libres` sin parámetros. Assessment: listo para cerrar. Mejoras de test opcionales, no aplicadas en este ticket.

## 5. Aprendizajes

- Ninguno estructural: cambio acotado a la validación de un comando existente, sin impacto en `tech-stack.md`, `constitution.md` ni skills del proyecto (`.claude/skills/` no existe).

## 6. Adendas

- _Ninguna._
