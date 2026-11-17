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
| 2 | Listado de canceladas | done | (commit de la task 2) | |

Revisión final: code-reviewer + opus, limpia, sobre (HEAD)

## Rulings

- Task 2: Ruling: hice la Task 2 antes de terminar los mensajes de error de la Task 1 — el listado necesitaba el estado `cancelled` ya guardado — si me equivoco, un commit de más en la Task 1.
- Task 2: Ruling: arreglé `test/app.test.js`, que dependía del orden de las reservas en memoria y fallaba una vez de cada tres — fuera del plan, en el commit de la task — si me equivoco, el test vuelve a ser frágil.
