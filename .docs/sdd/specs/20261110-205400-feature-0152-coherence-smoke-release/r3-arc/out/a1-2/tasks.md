---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | e2cb2e5 | |
| 2 | Listado de canceladas | done | d14e431 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre d14e431

Re-revisión: d14e431..juntada en el cierre, sdd-kit:effort-high + opus, 2 Important (1 corregido, 1 resuelto con ruling) y 1 Minor diferido

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: fixed fila de la Task 1 con el commit de la Task 2 (d14e431 en vez de e2cb2e5) — suite 5/5
- Final: Ruling: el flag `--test-concurrency=1` del ruling de la Task 2 no se aplica y el gate sigue siendo `node --test` como dice el plan — `node --test` da 5/5 con y sin el flag, y cada fichero de test corre en su proceso, así que no hay carrera sobre el almacén en memoria; no hay workaround que apuntar como deuda — coste si es erróneo: un test inestable que aparecería en el gate
- Final: minor (deferred): falta el test del THEN «sin `--motivo` responde "motivo no válido…"» (spec) en `test/cancel.test.js`; el comportamiento sí se ve en la ejecución real
