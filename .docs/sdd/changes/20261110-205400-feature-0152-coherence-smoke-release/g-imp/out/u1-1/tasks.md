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
| 1 | Cancelar con motivo | done | (commit de la task 1) | |
| 2 | Listado de canceladas | done | (commit de la task 2) | enmienda 2026-11-11: sin «quién canceló» |

Revisión final: Spec opus+high, 1 Important (arreglado) · Código sonnet+high, 1 Important (arreglado) · Arquitectura no (plan), sobre d0c8e51
Pasada de fix: 18f6f3c, 2 hallazgos RED→GREEN (mutación)
Re-revisión: d0c8e51..18f6f3c, sdd-kit:effort-high + opus, limpia (2 hallazgos arreglados, sin roturas nuevas)

## Rulings

Task 2: Ruling: enmienda 2026-11-11 aprobada por Laura — el listado no enseña quién canceló (sin usuarios en la app); THEN y decisión 2 de la spec cambiados — si es un error, 'quién' se añade en una feature con usuarios
Final: Ruling: Eje Arquitectura no — el diff son 8 líneas en src/app.js sin señales — si es un error, un cambio de estructura no se revisaría
Final: minor (deferred): test de canceladas depende del estado que deja el test 1 (el GIVEN no lo prepara el propio test)
Final: minor (deferred): canceladas sin test de lista vacía, de varias canceladas ni de una anulada; lista vacía imprime línea en blanco
Final: minor (deferred): reasonOf no impide que --motivo ocupe la posición de sala o día
Final: Ruling: spec marca los requisitos como ADDED y la decisión 3 y Capacidades hablan de MODIFIED — incoherencia anterior a la enmienda, no la toco — el delta podría fusionarse mal en capabilities/
Final: Ruling: aprobaciones de la spec solo recogen la del 2026-10-08; la de la enmienda consta en «Enmiendas» — no añadí fila nueva — si Laura quiere constancia formal, hay que añadirla
