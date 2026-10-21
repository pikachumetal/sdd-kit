---
id: 20261021-174559-feature-0207-e2e-review-and-closing
title: Tasks — E2E en la revisión y el cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-10-21
---

# Tasks — E2E en la revisión y el cierre (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0207-e2e-review-and-closing`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Restos de la 0180: la migración con los seis campos E2E y `test.fixme` con argumentos | done | 60f73e47 | |
| 2 | El eje Código marca los E2E que no siguen la política del proyecto | done | 7e1523a1 | |
| 3 | La suite E2E del cierre: entorno, gate tal cual, presupuesto y tanda | done | 6fa6d47a | afectada por enmienda 2026-10-21 (línea `Tanda:` en el 4.1), dentro de la task en curso |

Revisión final: Spec opus+high, 7 Important y 3 Minor · Código sonnet+high, 1 Important y 10 Minor · Arquitectura no (plan), sobre 6fa6d47a
Pasada de fix: juntada en el cierre, 12 hallazgos (8 RED→GREEN con Pester, 1 con ejecución, 3 de texto), 9 rulings
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important nuevo (enmienda aprobada) y 3 Minor (rulings)

## Verificación por task

- [x] Task 1 — `v3` ×1 con V13; `WordBudget` y `MigrationInitParity`
- [x] Task 2 — `f5` ×2 y `f4` ×2; `VerifySkill`
- [x] Task 3 — `e1` ×2, `e2` ×2 (+2 REFACTOR ×2), `a3r` ×1, `a1` ×1; `ClosingVerification`, `ArchiveSkill`, `WordBudget`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

_Se pega al cerrar._
