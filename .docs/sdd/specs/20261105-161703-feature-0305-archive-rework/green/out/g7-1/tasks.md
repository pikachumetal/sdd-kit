---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | cc59a51 | |
| 2 | Listado de canceladas | done | da2fbcc | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre da2fbcc
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, Needs fixes: solo de registro (commit de la Task 1 mal anotado, corregido; ruling de la Task 2 sin aplicar, anotado) · el script `cancelar` de `package.json`, limpio

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Cierre: no aplicado. `gate.json` no lleva `--test-concurrency=1` y `node --test` entero pasa 6/6 sin él; no he visto la carrera que el ruling cita (una pasada). Queda en la deuda como dependencia de orden dentro de `test/cancel.test.js`.
