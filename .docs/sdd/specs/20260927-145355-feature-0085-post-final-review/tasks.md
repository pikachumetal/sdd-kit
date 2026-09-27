---
id: 20260927-145355-feature-0085-post-final-review
title: Tasks — Bordes de la revisión después de la revisión final de rama
spec: ./spec.md
plan: ./plan.md
created: 2026-09-27
---

# Tasks — Bordes de la revisión después de la revisión final de rama (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0085-post-final-review`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Re-revisión del tramo posterior a la revisión final | done | 459a738 | RED p2 0/2 → GREEN 2/2 antes del merge (1/2 antes de invocar el cierre) |
| 2 | Commit pequeño de solo docs revisado en el hilo | done | 788b2c2 | RED s1 0/2 → GREEN 2/2; umbral también en los pasos 6 y 7 tras la primera tanda |
| 3 | Reproducir antes de arreglar un hallazgo de ejecución | done | 2c39f4a | RED f1 0/2 → GREEN 2/2; Native, control, 2/2 |

## Verificación por task

- [x] Task 1 — Pester de `PostFinalReview` y `ControlProfiles`; campaña GREEN `p1 p2`
- [x] Task 2 — Pester de `PostFinalReview` y `ControlProfiles`; campaña GREEN `s1 s2`
- [x] Task 3 — Pester de `PostFinalReview`; campaña GREEN `f1 f2`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

Revisión final: sdd-kit:effort-high + opus, With fixes (0 Critical, 4 Important, 5 Minor), sobre 2c39f4a; Important 1-3 arreglados en la pasada de fix, 4 como ruling
Deferred minors: disparador del paso 7 solo contra Revisión final:; Re-revisión: sin sitio sin tasks.md; anclas del paso 7; redacción de la exclusión de lectura; datos del plan de s1 y s2
