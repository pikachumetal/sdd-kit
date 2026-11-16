---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 5d853c0 | |
| 2 | Listado de canceladas | done | 7faa840 | también toca `e2e/cancel.e2e.mjs` (no estaba en «Ficheros» del plan) |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 7faa840
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos (2 Important y 1 Minor sobre este mismo fichero, corregidos en el cierre; 1 Minor de código, diferido)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No aplicado**: ni `package.json` ni `operations.md` lo llevan y el gate de cierre corrió como lo declara `operations.md`. La premisa tampoco se sostiene: `node --test` aísla un proceso por fichero y los tests de un fichero van en serie; lo que existe es una dependencia de orden (el test de `canceladas` usa el estado que deja el de `cancelar`), que va a la deuda.
