---
id: 20260909-180422-task-0000-reglas-de-capacidad
task: 0000
title: Walkthrough — Las cinco reglas que el agente decide al azar si nadie las escribe (T17)
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-09
---

# Walkthrough — Las cinco reglas que el agente decide al azar si nadie las escribe (T17)

Task en **modo full**; tres tasks en línea (motivo en el plan, decisión 1).

## 1. Cambios realizados

- `692795c` — spec (review de dominio: 10 hallazgos, 10 aceptados), plan, `tests/reglas-capacidad-red.md`.
- `3d9dfbc` — `funcional-template` (sección «Reglas de la capacidad»), `spec-template` (subsección en el delta), `review-spec.md` (punto 5 bis de la lente dominio: las cinco por nombre; inventada o contraria a la constitution = Crítico), `aprendizajes-skills.md` (fusión por nombre de entrada), `sdd-init-greenfield/SKILL.md` (las cinco preguntadas por nombre en el bloque de producto; constitution con «Reglas de producto»), `sdd-init-brownfield/references/generacion.md` (las cinco deducidas del código como propuesta).
- `3486f0f` — `tests/reglas-capacidad-green.md`; glosa por familia en `init-*` tras la primera iteración del GREEN.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,0 h (rango 0,7–1,5)
- Esfuerzo real: **~0,9 h** (aproximado: RED lanzado 18:17 UTC, GREEN-2 commiteado 19:10 UTC, cierre ~19:20 UTC; ocho sujetos de spec/entrevista + revisor, ~7,8 $). Spec + plan: ~0,5 h (con review de dominio).
- Desviación: −0,1 h (−10 %)
- Causa de la desviación: dentro del rango; la segunda iteración de entrevista (glosa) compensó el RED reutilizable.
- Review de spec: 1 revisor (lente dominio) · hallazgos 10, aceptados 10

## 3. Desviaciones del plan

- **Glosa por familia en `init-*`** (no prevista): el GREEN-1 de entrevista dio 5/5 por nombre pero el agente ilustraba *límites* como volumen y *avisos* como notificaciones; se añadió la glosa que ya llevaba `funcional-template` y se midió con dos sujetos más (C y D).
- **Primer intento del RED de spec sin medida**: con dev-lead ausente el sujeto se para en la primera pregunta de brainstorming (correcto); la petición pasó a decir «toma tú las decisiones y lístalas».

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 136, Failed: 0, Skipped: 5** en los tres commits.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-09 · en la conversación («ok vamos con el end-release»), sin prueba propia: acepta el GREEN del agente como validación.

| # | Caso (escenario del delta) | Resultado |
| --- | --- | --- |
| 1 | La spec fija las reglas de la capacidad que toca (`MODIFIED` en `flujo-de-task`) | ✅ verificado 2/2: subsección con las cinco; tope 100 y `localStorage` tomados de la constitution, citándola (RED: 3/5 con tope inventado 5 y 10) |
| 2 | La entrevista fija las cinco reglas de producto (`ADDED` en `onboarding`) | ✅ verificado 4/4 sujetos: las cinco preguntadas por nombre en el bloque de producto, antes del stack; constitution con «Reglas de producto» escrita en B (RED: 1/5, como persistencia en el bloque stack) |
| 3 | La lente dominio reclama las que falten / marca Crítico la contraria a la constitution | ⚠️ no medido: el revisor solo corre si el usuario lo activa y el RED de spec ya no falla sin él. Texto en `review-spec.md` (5 bis) |
| 4 | Brownfield propone las cinco deducidas del código | ⚠️ no medido: comparte la frase con greenfield; sin entrevista simulada propia |

### 4.3 Residuales / deuda generada

Ninguna. Los dos «no medido» son alcance de la spec («no entra: entrevista simulada de brownfield») y una guidance que no se dispara sin usuario; quedan anotados en la evidencia GREEN.

## 5. Aprendizajes

- **Entrevista simulada con persona**: un dev-lead Haiku con persona fija que responde solo lo que se le pregunta mide una skill de init headless (13–14 turnos, 0,4–0,7 $ por sujeto); se cuenta lo que el agente pregunta, no lo que sabe al final, porque la persona se va de la pregunta si la pregunta es abierta. → `tech-stack.md`.
- **Con dev-lead ausente la petición de spec debe ceder las decisiones**: si no, el sujeto se para en la primera pregunta de brainstorming, que es lo correcto y no mide nada. → `tech-stack.md`.
- **El bloque «Decisiones que he tomado yo» hace visible el azar**: el baseline escribió «elección arbitraria» y «sin referencia de negocio» junto al tope; sin nombres fijos, la spec no sabe qué le falta. → `tech-stack.md` (segunda lectura del hallazgo de T16).
- **La glosa viaja con el nombre**: nombrar una familia no basta si el agente la ilustra con sus propios ejemplos; la glosa de la plantilla tiene que ir también donde se pregunta. → `tech-stack.md`.
