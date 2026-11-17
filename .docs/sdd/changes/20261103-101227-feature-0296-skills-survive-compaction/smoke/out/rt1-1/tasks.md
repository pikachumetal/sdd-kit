---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 27029d8 | |
| 2 | Listado de canceladas | done | 019ea35 | |

Revisión final: autorrevisión (sin herramienta de subagentes) Spec + Código, Arquitectura no (plan), sobre 019ea35
Pasada de fix: c28b9b2, 2 hallazgos (tests que faltaban; verdes de entrada, comprobados con mutación)
Re-revisión: no se lanzó (sin herramienta de subagentes); c28b9b2 sin revisar por otra mano

## Rulings

Final: Ruling: revisión final sin herramienta de subagentes — autorrevisión por ejes Spec y Código — más débil que revisores frescos; decide la persona antes del merge
Final: minor (deferred): el test de canceladas depende del estado compartido que deja el primer test
Final: minor (deferred): canceladas sin reservas canceladas imprime una línea vacía (la spec no lo define)
Final: Ruling: Task 1 — RED y test por-THEN de la Task 1 no se pudieron comprobar (ya hecha ayer, sin ledger) — se aceptó por tasks.md y git log — coste si falla: un THEN sin RED visto
