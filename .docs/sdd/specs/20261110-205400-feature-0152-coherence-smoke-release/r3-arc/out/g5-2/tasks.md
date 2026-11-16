---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3d02824 | |
| 2 | Listado de canceladas | done | 758d168 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 758d168
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (ruling sin aplicar) y 1 Minor (commit de la Task 1) corregidos en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble — NO APLICADO (corregido en el cierre): `gate.json` no lleva la bandera y la suite sale verde 9/9 con la concurrencia por defecto; la carrera no se reprodujo y queda en «Por triar» de `debt.md`
