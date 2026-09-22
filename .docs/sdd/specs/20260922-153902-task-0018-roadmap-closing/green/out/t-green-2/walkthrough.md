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

- `src/app.js`: nueva regex `SLOT` (`HH:MM-HH:MM`, 24h) que valida `params[0]` antes de calcular `freeRooms`. Si no matchea, devuelve `error: franja no válida (HH:MM-HH:MM)` en vez de listar salas.
- `test/app.test.js`: test añadido para la franja mal escrita.
- Commit: `44feebe` — fix: libres valida la franja HH:MM-HH:MM.

## 2. Tiempo: estimado vs real

*(No aplica: `.docs/sdd/estimation.md` no existe en este proyecto — módulo de estimación no activado.)*

## 3. Desviaciones del plan

- Ninguna. Modo `lite`: no hay `plan.md` que comparar.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 4 pass, 0 fail.
- Code review (`superpowers:requesting-code-review`, `feature-dev:code-reviewer`, diff `2a78fe5..44feebe`): sin hallazgos con confianza ≥80. Confirma bordes de la regex (`24:00`, minutos `60`, espacios, franja ausente) y que la franja invertida (`12:00-10:00`) pasa sin error por estar fuera de scope (solo se valida formato, no orden).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 25:00-99` (da el error de formato) y `node src/app.js libres 10:00-12:00` (sigue dando `Sur`). Funciona.
- Verificado también por el agente, mismo resultado: `libres 25:00-99` → `error: franja no válida (HH:MM-HH:MM)`; `libres 10:00-12:00` → `Sur`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-99` | `error: franja no válida (HH:MM-HH:MM)` |
| 2 | `libres 10:00-12:00` | `Sur` |
| 3 | `node --test test/` (suite completa) | 4 pass, 0 fail |

### 4.3 Residuales / deuda generada

- `cancelar` sigue sin validar el día (fuera de scope, explícito en la spec). Queda abierto en la fila de deuda técnica del roadmap, ahora cerrada solo en parte.

## 5. Aprendizajes

- Ninguno con destino en doc vivo: cambio acotado a una regex de validación, sin convención nueva, sin cambio estructural, sin cambio de versión/herramienta. Este proyecto no declara módulo de `capabilities/`, así que el delta de comportamiento queda documentado solo en `spec.md` y este walkthrough.

## 6. Adendas

- Ninguna.
