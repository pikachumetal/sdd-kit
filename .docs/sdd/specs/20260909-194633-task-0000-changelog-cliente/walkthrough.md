---
id: 20260909-194633-task-0000-changelog-cliente
task: 0000
title: Walkthrough — Changelog de cliente además del técnico (T18)
spec: ./spec.md
status: done
created: 2026-09-09
---

# Walkthrough — Changelog de cliente además del técnico (T18)

Task en **modo lite**.

## 1. Cambios realizados

Commit `3219031`:

- `skills/sdd-templates/templates/changelog-cliente-template.md` (nueva) e índice de `sdd-templates`; README con 12 plantillas.
- `skills/sdd-init-greenfield/SKILL.md` (d) y `skills/sdd-init-brownfield/references/generacion.md` paso 5: «¿y novedades para el cliente?».
- `skills/sdd-end-release/references/notas-y-roadmap.md`: «smoke: pendiente» si no se ejecutó; el número no se inventa (hallazgo colateral del RED).
- `tests/changelog-cliente-red.md`: baseline 2/2 actualiza el acumulado derivando de las release notes → sin paso nuevo en `sdd-end-release`.
- Dogfooding en el cierre de la release: `.docs/sdd/changelog-cliente.md` del kit.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 0,6 h (rango 0,4–0,9)
- Esfuerzo real: **~0,4 h** (aproximado: spec aprobada 19:50 UTC, commit 20:09 UTC, cierre ~20:15 UTC; tres sujetos de release + una entrevista, ~2,2 $). Spec: ~0,15 h.
- Desviación: −0,2 h (−33 %)
- Causa de la desviación: el RED desautorizó el paso 5 bis y su GREEN.
- Review de spec: no · hallazgos 0 (lite)

## 3. Desviaciones del plan

Sin plan (lite). Una respecto a la spec: la línea de smoke de `notas-y-roadmap.md` (T15) gana «pendiente» por el hallazgo colateral; medido 1 de 2, sin GREEN propio.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 136, Failed: 0, Skipped: 5** (tras corregir el recuento de plantillas del README, que el test exige).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-09 · en la conversación («si»), sin prueba propia: acepta el RED y el GREEN del agente como validación.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Con `changelog-cliente.md` presente, `sdd-end-release` añade la sección de la versión derivada de las release notes | ✅ verificado 2/2 en disco (Resumen y Novedades idénticos a `releases/v1.3.0/release-notes.md`) |
| 2 | La entrevista de init pregunta por el changelog de cliente | ✅ verificado 1/1 (entrevista simulada, T12) |
| 3 | El kit estrena su `changelog-cliente.md` | ✅ en el cierre de v1.0.0 (este mismo día) |

### 4.3 Residuales / deuda generada

Ninguna.

## 5. Aprendizajes

- **El fichero es la guidance**: un artefacto presente con su forma (sección v1.2.0 calcada) bastó para que el agente lo continuara derivando; la skill no tuvo que decirlo. Novena vez que el RED recorta. → `tech-stack.md`.
- **Una línea que pide un número invita a inventarlo**: «smoke: fecha · N hallazgos» produjo «0 hallazgos» sin smoke en 1 de 2; la salida honesta («pendiente») hay que nombrarla. → `tech-stack.md`.
