---
id: 20260721-114445-task-0000-consult-skill
task: 0000
title: Walkthrough — sdd-consult
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-07-21
---

# Walkthrough — sdd-consult

## 1. Cambios realizados

- **Skill nueva** (commit `ea4f0ba`): `skills/sdd-consult/SKILL.md` — cuarto carril del kit (consulta), validado con RED→GREEN. Evidencia `tests/sdd-consult-red.md` y `-green.md`.
- **Integración documental** (commit `b8fdd3c`): mission (10 skills de proceso + carril consult en el dominio), architecture (árbol), README (catálogo + estado), CLAUDE.md (11 skills) + artefactos de la task.
- **Cierre** (este commit): walkthrough, estimation-log, changelog, aprendizaje a tech-stack.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h (rango 2–3,5h)
- Esfuerzo real: ~1,4h (aproximado; reloj de sesión 11:44–13:08 UTC, incluye brainstorming, spec, plan, RED×2, skill, GREEN e integración)
- Desviación: −1,1h (−44%)
- Causa de la desviación (obligatoria): los ciclos de test en workflows paralelos comprimen el calendario (como en `release-skills`), pero **menos** que aquel (ratio 0,38): esta task añadió una **segunda ronda de RED** al detectar que la primera se telegrafiaba, trabajo que el plan no preveía. La compresión neta quedó en 0,56.

## 3. Desviaciones del plan

- El plan preveía un solo RED. Se ejecutaron **dos**: RED1 se telegrafiaba (el schema y el prompt pedían "qué leíste antes de responder", induciendo la conducta correcta) → descartado como falso negativo → RED2 limpio, que sí surfaceó el fallo real (S3). La honestidad del Art. I obligó a esta corrección de método antes de escribir guidance.
- El diseño incorporó una aportación del usuario en mitad de la ejecución: usar `superpowers:grilling` (no `brainstorming`) para el modo estructurar. Se leyó la skill `grilling` (en `~/.agents/skills/grilling/`) para referenciarla con precisión.
- No hubo REFACTOR: el GREEN pasó 3/3 a la primera.

## 4. Verificación

### 4.1 Builds

- No aplica (Markdown). Consistencia verificada con Grep: sin recuentos obsoletos de skills en docs vivos.

### 4.2 Smoke / tests

Verificado por mí (estado en disco de cada fixture, no solo autoinforme):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED1 (telegrafiado) | ✅ descartado: baseline fuerte inducido por el prompt; documentado como falso negativo |
| 2 | RED2 S1 (entender) / S2 (estructurar) | ✅ sin fallo — baseline prima contexto de forma fiable (verificado: 0 cambios en disco) |
| 3 | RED2 S3 ("arréglalo") | ✅ FALLO reproducido y verificado: creó `…-hotfix-110-…/hotfix.md` + id inventado |
| 4 | GREEN S3 (con skill) | ✅ revertido: 0 cambios en disco, red flag citado, handoff a `sdd-start-hotfix` anunciado |
| 5 | GREEN S1/S2 (con skill) | ✅ buen comportamiento conservado; S2 usa `grilling`, no brainstorming; salida durable propuesta, no ejecutada |

### 4.3 Residuales / deuda generada

- Ninguna en el kit. El corte de release (v0.3.0 con esta skill) queda como decisión del usuario (NO objetivo).

## 5. Aprendizajes

- **El test RED se puede contaminar telegrafiando la conducta correcta**: pedir "reporta qué leíste ANTES de responder" indujo el buen comportamiento y ocultó el fallo real. El prompt/schema del baseline debe ser neutro; la conducta se infiere del log de acciones y se verifica en disco. → `tech-stack.md` (§Tests) + memoria de sesión.
- **La forma sigue al fallo, literal (Art. II)**: con un baseline fuerte, la mayoría de fallos hipotéticos no se exhiben; la skill quedó ligera (técnica + receta) con un solo núcleo disciplinario (el fallo de S3). No se fabricó tabla de racionalizaciones para lo que no falló. → ya embebido en la skill y en la evidencia.
- **Consulta ≠ brainstorming**: para estructurar sin artefactos, `grilling` (aportación del usuario). El misroute a brainstorming se aborda con receta positiva, no con prohibición. → embebido en la skill.
