---
id: 20260922-133931-task-0025-scope-brake
title: Tasks — Freno de alcance en ejecución
spec: ./spec.md
plan: ./plan.md
created: 2026-09-22
---

# Tasks — Freno de alcance en ejecución (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0025`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Tests de anclas y docs del repo | done | 02d3062 | RED: 5 de 6 anclas fallan; la sexta es guarda |
| 2 | Guía de los frenos de alcance | done | 659a9e8 | subagente Sonnet (effort high escrito en el encargo: el tool no lo expone); suite 297/0 |
| 3 | GREEN | done | 49a76e1 | 20 sujetos en cuatro vueltas, 15,04 $; tres retoques de la guía desde el hilo (plan, Step 4), dentro de la revisión |

## Verificación por task

- [x] Task 1 — `ScopeBrake.Tests.ps1` aparcado en RED (5 fallos); suite completa verde en el commit
- [x] Task 2 — `ScopeBrake.Tests.ps1` movido a `tests/`, 6/6; suite 297/0
- [x] Task 3 — E1–E5 2/2 en la última guía; suite 297/0

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Ruling: la revisión única se despacha tras el GREEN y no tras la Task 2 — si el GREEN obliga a retocar la guía, un solo revisor lee la versión definitiva — coste si es erróneo: una revisión más tarde, sin código despachado encima.
- Ruling: los retoques de la guía que pidió el GREEN (comparación de fila fundida con los tests RED y escrita como incondicional; bucle de fix fuera del freno) los hace el hilo y no un fix wave — cada retoque es de una frase y se mide con sujetos al momento — coste si es erróneo: la revisión los ve igual, entran en su alcance.
- Ruling: la revisión final pidió cambios (1 Critical, 3 Important, 3 Minor); se aceptan 6 y se rechaza parafrasear la cita «Four things stop you, and only these» (citar la frase que se arbitra es citar, Art. IX) — arreglos en 66c96f7; la re-revisión pidió dos más, en 879b1e1, y aprobó — coste: dos rondas de revisión en lugar de una.

## Revisión

- Revisión final de rama (Sonnet, medium, cabecera de restricciones): CAMBIOS → 66c96f7.
- Re-revisión: CAMBIOS (2) → 879b1e1 → APROBADA. Suite 297/0.
