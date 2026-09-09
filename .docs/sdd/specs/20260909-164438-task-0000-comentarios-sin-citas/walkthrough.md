---
id: 20260909-164438-task-0000-comentarios-sin-citas
task: 0000
title: Walkthrough — Comentarios que citan documentos (T14)
spec: ./spec.md
status: done
created: 2026-09-09
---

# Walkthrough — Comentarios que citan documentos (T14)

Task en **modo lite**.

## 1. Cambios realizados

- `.docs/sdd/constitution.md` Art. X: segunda regla, «sin comentarios que citen documentos» (`8d3f3a7`).
- `skills/sdd-templates/templates/plan-template.md`: la ayuda de Restricciones globales nombra las dos reglas de comentarios y pide escribirlas aunque la constitution del consumidor no las tenga (`8d3f3a7`).
- `tests/comentarios-sin-citas-red.md` (`33a7a2f`): 6/6 runs sin comentarios; el punto para el revisor en `encargo-revision.md` no se escribe. Trampa de método (despachos en segundo plano) en `tech-stack.md`.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 0,5 h (rango 0,3–0,8)
- Esfuerzo real: **~0,3 h** (aproximado: spec aprobada 16:48 UTC, evidencia commiteada 17:03 UTC, cierre ~17:08 UTC; tres sujetos, 5,5 $). Spec: ~0,1 h más la aclaración de la decisión 4.
- Desviación: −0,2 h (−40 %)
- Causa de la desviación: la rama «si falla» no se ejecutó (mismo patrón que T12 y T13).
- Review de spec: no · hallazgos 0 (lite)

## 3. Desviaciones del plan

Sin plan (lite). Respecto a la spec: B se repitió como B2 por la trampa de los despachos en segundo plano.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 136, Failed: 0, Skipped: 5**.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-09 · en la conversación («validado, cierra T14»), sobre lo presentado por el agente.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Implementación completa con despachos → comentarios que citen documentos | ✅ verificado en disco: 0 comentarios en A y B2 (y 0 en los cuatro runs de T11) |
| 2 | Art. X y ayuda de la plantilla | ✅ verificado: texto en su sitio; Pester verde |

### 4.3 Residuales / deuda generada

Ninguna.

## 5. Aprendizajes

- **Séptima vez que el RED recorta**: el fallo de otro contexto (C#/TS, docs largos) no se reproduce con Sonnet y el Art. V en el encargo; la regla queda como principio y forma, no como guidance de revisión. → `tech-stack.md` (patrón ya recogido).
- **Despachos en primer plano en headless**: un `run_in_background` acaba la sesión sin resultado. → `tech-stack.md` (ya anotado).
