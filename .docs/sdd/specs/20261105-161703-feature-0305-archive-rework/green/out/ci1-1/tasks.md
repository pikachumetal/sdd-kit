---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 672489a | |
| 2 | Listado de canceladas | done | baa9d12 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre baa9d12
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos: hash de la Task 1 corregido (Important) y Ruling del flag anotado (Minor)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Cierre: el flag `--test-concurrency=1` no llegó al gate (plan.md y la CI corren `node --test`) y no hace falta: cada fichero de test corre en su propio proceso; `node --test` pasó 5/5 veces seguidas en el cierre. El Ruling queda como registro de lo que se decidió en la Task 2.
