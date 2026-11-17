---
id: 20260909-160248-task-0000-review-reforzada
task: 0000
title: Walkthrough — Review reforzada opt-in por task (T12)
spec: ./spec.md
status: done
created: 2026-09-09
---

# Walkthrough — Review reforzada opt-in por task (T12)

Task en **modo lite**, cerrada como **decisión sin cambio en el kit**: el RED demostró que la review por defecto basta.

## 1. Cambios realizados

- `tests/review-reforzada-red.md` (`a9eebf5`): fixture "Ledgerly-cursos" con el bug de SifAcademy 0001 plantado (`publish` sin guarda de estado, sin test de rechazo, spec que exige «solo un curso en borrador se publica») y dos sujetos headless que ejecutaron las revisiones de `subagent-driven-development` con la cabecera de `encargo-revision.md`.
- Ningún fichero del kit cambia. `research.md` de T11 queda como fuente de la decisión con este resultado.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 0,8 h (rango 0,5–1,2)
- Esfuerzo real: **~0,4 h** (aproximado: spec aprobada 16:05 UTC, evidencia commiteada 16:27 UTC, cierre ~16:35 UTC; dos sujetos en paralelo, 2,5 $). Spec: ~0,2 h.
- Desviación: −0,4 h (−50 %)
- Causa de la desviación: el baseline pasó y la rama «si falla» del plan (plantilla, fichero de reglas, GREEN, ~25 min) no se ejecutó. Estimar la guidance condicionada al RED como coste cierto sigue siendo el sesgo de `estimation.md`.
- Review de spec: no · hallazgos 0 (rúbrica: ninguna señal; lite)

## 3. Desviaciones del plan

Sin plan (lite). Respecto a la spec: ninguna; se ejecutó la rama «el baseline caza el bug → no se añade nada» de la decisión 1.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 136, Failed: 0, Skipped: 5**.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-09 · en la conversación tras la presentación del gate («ok, siguiente task»); validó sobre lo presentado por el agente, sin detallar qué probó.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Revisor de task caza la guarda de `publish` | ✅ verificado: 2/2 Critical, anclado en el requisito de la spec |
| 2 | Revisor final la caza | ✅ verificado: 2/2 Critical |
| 3 | Cabecera de restricciones en los encargos (T11) | ✅ verificado por `stream-json`: 4/4 |
| 4 | Sin refutador automático: los hallazgos llegan al hilo principal tal cual | ✅ verificado: ambos sujetos los listaron sin filtrar |

### 4.3 Residuales / deuda generada

Ninguna. Un consumidor que quiera una review multi-lente para una task concreta la declara en su plan como task en línea con motivo y la monta con sus encargos; no es mecanismo del kit.

## 5. Aprendizajes

- **Con contrato cerrado en la spec y restricciones en el encargo, la review por defecto caza el bug de transición de estado** (4/4 Critical): la lectura de SifRest se confirma en el kit y la review multi-lente queda fuera. → `estimation.md` (ancla: no presupuestar review adversarial por defecto) y `tech-stack.md`.
- **Trampa de fixture**: el código plantado debe ir en un commit propio de la rama; si está en el commit base compartido con `main`, el revisor final lo señala como «rama que no aporta nada» y desvía la revisión. → `tech-stack.md`.
- **Sexta vez en la release que el RED reduce el alcance**: aquí a cero. → `tech-stack.md` (ya recogido como patrón; se cuenta).
