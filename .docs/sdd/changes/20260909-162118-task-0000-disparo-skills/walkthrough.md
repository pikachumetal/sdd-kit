---
id: 20260909-162118-task-0000-disparo-skills
task: 0000
title: Walkthrough — Disparo de las skills y dos vías del Gate 1 (T13)
spec: ./spec.md
status: done
created: 2026-09-09
---

# Walkthrough — Disparo de las skills y dos vías del Gate 1 (T13)

Task en **modo lite**.

## 1. Cambios realizados

- `skills/sdd-start-task/SKILL.md` Gate 1: dos vías explícitas — invocación sola → contexto y parar; con enunciado → contexto y seguir por el enrutado (`30956c3`).
- `tests/disparo-skills-red.md`: dos sujetos headless con «implementa la task 77 del roadmap» sin nombrar skill; `sdd-kit:sdd-start-task` disparó sola 2/2. Ni la `description` ni `init-*` cambian (decisión 2 de la spec).

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 0,6 h (rango 0,4–1)
- Esfuerzo real: **~0,35 h** (aproximado: spec aprobada 16:24 UTC, evidencia commiteada 16:41 UTC, cierre ~16:50 UTC; dos sujetos, 3,5 $). Spec: ~0,15 h.
- Desviación: −0,25 h (−40 %)
- Causa de la desviación: el baseline disparó y las dos ramas condicionadas (regla en `CLAUDE.md`, `description`) no se ejecutaron. Mismo sesgo que T12.
- Review de spec: no · hallazgos 0 (rúbrica: ninguna señal; lite)

## 3. Desviaciones del plan

Sin plan (lite). Respecto a la spec: ninguna.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 136, Failed: 0, Skipped: 5**.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-09 · en la conversación («Validado, cierra T13»), sobre lo presentado por el agente.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | «Implementa la task 77» sin nombrar skill → `sdd-start-task` como primera skill | ✅ verificado 2/2 (`tool_use` de `Skill` en `stream-json`) |
| 2 | Vía «con enunciado»: contexto y seguir | ✅ verificado: A recorrió spec → plan → implementación → parada en el gate de validación; B siguió hasta la primera pregunta de `brainstorming` |
| 3 | Vía «sola»: contexto y parar | ✅ verificado en esta sesión (invocación de `/sdd-kit:sdd-start-task` sin enunciado paró en el Gate 1) |

### 4.3 Residuales / deuda generada

Ninguna. El hook de sesión queda descartado sin discusión.

## 5. Aprendizajes

- **La `description` basta como disparador**: con la petición más común y sin pista en el `CLAUDE.md`, 2/2. Antes de añadir reglas de disparo a `init-*` o hooks, medir. → `tech-stack.md`.
- **Primer recorrido de extremo a extremo tras T11 sin nombrar ninguna skill** (A): enrutado, review de spec, plan por decisiones, despachos con cabecera y parada en el gate de validación. Es la verificación de integración de la release, obtenida como colateral. → `tech-stack.md`.
