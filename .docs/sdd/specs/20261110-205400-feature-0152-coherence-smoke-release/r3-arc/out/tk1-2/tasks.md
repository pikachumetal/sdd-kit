---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 9042cfe | |
| 2 | Listado de canceladas | done | 5e65b57 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 5e65b57
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 Important (1 corregido: commit de la Task 1; 1 sostenido: ruling) y 1 Minor (a deuda)
Pasada de fix: 1 hallazgo corregido, 1 sostenido con ruling, 1 Minor a deuda

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: el ruling de `--test-concurrency=1` se queda como lo escribió la ejecución, pero no se reproduce: en el cierre `node --test` plano (el gate del plan) dio 5/5 tres veces seguidas y el repo no aplica la opción en ningún fichero; el gate del cierre corre plano
