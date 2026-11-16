---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | bf75bc7 | |
| 2 | Listado de canceladas | done | 43e3d5d | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 43e3d5d

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Corrección del cierre: medido con `node --test` y con `--test-concurrency=1`, 5/5 en las dos (cada fichero de test corre en su proceso: no hay carrera entre ficheros); el gate del plan sigue siendo `node --test`. Lo real es el acoplamiento por orden de `test/cancel.test.js` (la prueba de `canceladas` depende de que la primera haya cancelado Norte lun); va a la deuda.

Re-revisión: sdd-kit:effort-high + opus, con hallazgos, juntada en el cierre
Pasada de fix: juntada en el cierre, 1 hallazgo (commit de la Task 1 en esta tabla)
