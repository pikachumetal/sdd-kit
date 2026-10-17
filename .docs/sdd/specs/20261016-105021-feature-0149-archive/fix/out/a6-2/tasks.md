---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | a89bab5 | |
| 2 | Listado de canceladas | done | e983676 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre e983676
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (el ruling del gate, comprobado y corregido en el cierre) · 6 Minor al ledger

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Corrección en el cierre: la carrera no se reproduce. `node --test` a secas sale 5/5 en 8 de 8 ejecuciones, y el gate de la constitution y del plan sigue siendo `node --test`. El flag no se usa ni queda como workaround; lo que sí queda es que `test/cancel.test.js` depende del orden de sus tests (deuda en el roadmap).
