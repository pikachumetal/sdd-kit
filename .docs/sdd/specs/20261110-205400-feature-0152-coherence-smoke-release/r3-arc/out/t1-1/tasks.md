---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 8cfadb3 | |
| 2 | Listado de canceladas | done | f34dd22 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre f34dd22
Re-revisión: f34dd22..1db097b, sdd-kit:effort-high + opus, 2 Important (commit de la Task 1; ruling no aplicado) corregidos en tasks.md, 1 Minor (plan.md: comando de arranque) a la deuda

## Rulings

- Task 2: Ruling descartado en el cierre: `--test-concurrency=1` se anotó pero no está en ningún gate ni en `package.json`, y no arregla nada (cada fichero va en su proceso). Lo real: el test `canceladas enseña sala, día y motivo` solo pasa si corre antes el primero de `test/cancel.test.js` (depende del orden) — a la deuda
