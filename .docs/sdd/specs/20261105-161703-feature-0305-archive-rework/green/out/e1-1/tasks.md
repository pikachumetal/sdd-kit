---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 11ea873 | Corregido en el cierre: la tabla decía 745393d, que es la Task 2 |
| 2 | Listado de canceladas | done | 745393d | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 745393d

Re-revisión: juntada en el cierre (solo `tasks.md`), sdd-kit:effort-high + opus, con hallazgos: 2 Important (commit de la Task 1; Ruling del gate) y 1 Minor (sin fila de deuda), tratados en el cierre — ver Rulings

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Cierre: Ruling: el flag `--test-concurrency=1` no llegó a aplicarse — `package.json`, `operations.md` y el plan siguen con `node --test test/` y el gate pasa 5/5 sin él — se deja el gate como está declarado; lo real es una dependencia de orden dentro de `test/cancel.test.js` (`canceladas` solo pasa tras `cancelar con un motivo de la lista`), anotada como deuda — coste si es erróneo: un test que falla al ejecutarlo suelto
