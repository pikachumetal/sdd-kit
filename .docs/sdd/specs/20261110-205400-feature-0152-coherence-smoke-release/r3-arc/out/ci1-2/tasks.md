---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 4909dd7 | |
| 2 | Listado de canceladas | done | 9710be0 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 9710be0
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos (2 Important de documentación de `tasks.md`, corregidos en el cierre; 1 Minor diferido)
Final: minor (deferred): ningún test cubre «cancelar sin --motivo» de la spec

## Rulings

- Task 2: Ruling: el workaround `node --test --test-concurrency=1` que el hilo anotó no existe: el gate de cierre es `node --test` (plan.md y `.github/workflows/ci.yml`) y pasa 5/5. La causa real es que `canceladas enseña sala, día y motivo` depende del orden de los tests de `test/cancel.test.js` (el almacén en memoria vive por proceso) — corregido en el cierre al ver que la re-revisión lo desmentía — coste si es erróneo: ninguno, el gate no cambia
