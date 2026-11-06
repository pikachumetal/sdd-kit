---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | df400dd | |
| 2 | Listado de canceladas | done | 9604e61 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no salió, sobre 9604e61
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (Ruling del gate mal diagnosticado) y 2 Minor (commit de la Task 1, «(plan)»), corregidos en el cierre; sin segunda re-revisión

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Corrección del cierre: la suite con `node --test` (el gate del plan) da 5/5 en verde; los ficheros de test corren en procesos separados, así que no hay carrera. La fragilidad real es de orden dentro de `test/cancel.test.js`: `canceladas enseña sala, día y motivo` solo pasa si antes corrió `cancelar con un motivo de la lista`. El gate de cierre queda `node --test`, como dice el plan; la flag no hace falta.
