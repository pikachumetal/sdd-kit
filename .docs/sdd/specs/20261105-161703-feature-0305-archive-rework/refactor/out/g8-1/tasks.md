---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 4e1c2ee | commit corregido en el cierre (decía 886f0fd, que es el de la Task 2) |
| 2 | Listado de canceladas | done | 886f0fd | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 886f0fd

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, sin hallazgos de código; 2 de registro (commit de la Task 1, ruling de la Task 2) corregidos en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén compartido en memoria — **no aplicado**: `gate.json` y el plan no lo llevan, y no se comprobó la causa. En el cierre se vio que el test `canceladas` falla solo, porque depende de que el test anterior haya cancelado Norte lun (acoplamiento de orden dentro de `test/cancel.test.js`, no concurrencia); queda como deuda — coste si es erróneo: ninguno, no hay workaround en el gate
