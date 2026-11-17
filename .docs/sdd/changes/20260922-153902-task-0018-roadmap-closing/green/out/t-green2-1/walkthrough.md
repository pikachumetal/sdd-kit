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

- `src/app.js`: se añade `SLOT`, un regex que valida `HH:MM-HH:MM` en 24h (horas `00-23`, minutos `00-59`, anclado con `^…$`). El comando `libres` valida `params[0]` contra `SLOT` antes de calcular las salas libres; si no cumple, devuelve `error: franja no válida (HH:MM-HH:MM)` en vez de listar salas. `params[0] ?? ''` cubre también el caso sin argumento. Commit `b616172` (fix: libres valida la franja HH:MM-HH:MM).
- `test/app.test.js`: test nuevo `libres rechaza una franja mal escrita`, que comprueba `libres 25:00-99` contra `/^error: franja no válida/`.

## 2. Tiempo: estimado vs real

> No existe `.docs/sdd/estimation.md` en este proyecto: sección informativa, no bloquea el cierre.

- Tipo: backend (CLI)
- Estimación (spec): media hora
- Esfuerzo real: ~media hora
- Desviación: ninguna relevante
- Review de spec: no (modo lite, sin revisor de spec)

## 3. Desviaciones del plan

- _Ninguna._ Modo `lite`: no hay `plan.md` ni `tasks.md`.

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` en el repo: 4/4 tests OK (`libres excluye la sala reservada en la franja`, `reservar --cada-semana crea la reserva semanal`, `cancelar respeta el día`, `libres rechaza una franja mal escrita`). Ejecutado por mí antes de cerrar.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · ejecutó `node src/app.js libres 25:00-99` (da el error de formato) y `node src/app.js libres 10:00-12:00` (sigue dando `Sur`). Confirma ambos escenarios del spec.
- Code review (`superpowers:requesting-code-review`, subagente independiente sobre `0d5428d..b616172`): sin hallazgos Critical ni Important. Dos Minor no bloqueantes: falta test explícito para `libres` sin argumento (el código ya lo cubre vía `?? ''`), y el regex no valida que la hora de inicio sea anterior a la de fin — consistente con el scope del spec (solo formato).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-99` | `error: franja no válida (HH:MM-HH:MM)` — validado por dev-lead |
| 2 | `libres 10:00-12:00` | `Sur` — validado por dev-lead |
| 3 | `node --test` (suite completa) | 4/4 OK — verificado por mí |

### 4.3 Residuales / deuda generada

- Validar el día de `cancelar` queda fuera de scope (spec §Scope) — sigue en la fila de deuda técnica del roadmap, ahora como pendiente parcial.
- Minor del code review (test sin argumento, orden inicio/fin) no generan deuda nueva: son observaciones dentro del scope ya cerrado, no defectos.

## 5. Aprendizajes

- _Ninguno estructural._ Fix acotado y determinista (regex + guard), sin impacto en constitution/architecture/tech-stack. `.claude/skills/` no existe en este proyecto → revisión de skills no aplica.

## 6. Adendas

- _Ninguna._
