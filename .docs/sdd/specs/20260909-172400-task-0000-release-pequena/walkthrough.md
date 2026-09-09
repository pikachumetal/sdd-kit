---
id: 20260909-172400-task-0000-release-pequena
task: 0000
title: Walkthrough — Release pequeña primero y smoke por tramo (T15)
spec: ./spec.md
status: done
created: 2026-09-09
---

# Walkthrough — Release pequeña primero y smoke por tramo (T15)

Task en **modo lite**.

## 1. Cambios realizados

- `skills/sdd-end-release/references/notas-y-roadmap.md` paso 6: la release colapsada lleva «smoke: fecha · N hallazgos» (`f28791a`).
- `tests/release-pequena-red.md` (`11227b2`): `sdd-start-release` propone pequeño 2/2 en la primera release; sin guidance en el paso 2.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 0,5 h (rango 0,3–0,8)
- Esfuerzo real: **~0,25 h** (aproximado: spec aprobada 17:26 UTC, evidencia commiteada 17:38 UTC, cierre ~17:42 UTC; dos sujetos, 0,7 $). Spec: ~0,1 h.
- Desviación: −0,25 h (−50 %)
- Causa de la desviación: la rama «si falla» no se ejecutó.
- Review de spec: no · hallazgos 0 (lite)

## 3. Desviaciones del plan

Sin plan (lite). Ninguna respecto a la spec.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 136, Failed: 0, Skipped: 5**.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-09 · en la conversación («ok»), sobre lo presentado por el agente.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Primera release con ocho ítems → propuesta pequeña | ✅ verificado 2/2: núcleo de 2–3 ítems, resto pospuesto con bloqueos, scope al usuario |
| 2 | Línea de smoke en el colapso | ✅ texto en su sitio; se ejecuta al cerrar v0.6.0 |

### 4.3 Residuales / deuda generada

Ninguna. Capacidad `carril-release` en `funcional/` anotada como candidata para la task que la toque de verdad.

## 5. Aprendizajes

- **Priorizar por riesgo y dependencias ya produce releases pequeñas**: la skill no necesita decir «pequeña» para proponer un núcleo de dos o tres ítems. → `tech-stack.md` (patrón del RED que recorta, octava vez).
