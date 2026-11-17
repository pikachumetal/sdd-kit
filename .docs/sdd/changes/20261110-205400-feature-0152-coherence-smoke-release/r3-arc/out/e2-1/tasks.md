---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3d17cfc | |
| 2 | Listado de canceladas | done | 00dca6d | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 00dca6d
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos (2 Important, 1 Minor) adjudicados abajo

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Cierre: Ruling: el flag `--test-concurrency=1` del ruling anterior no está en la rama ni en el gate declarado (`operations.md` §Testing); la suite pasa sin él — el gate se corrió como está declarado — coste si está mal: el test `canceladas` depende de que antes corra `cancelar … sala ocupada` en el mismo fichero y no es independiente; deuda en «Por triar»

## Ledger

- Final: fixed la fila de la Task 1 citaba `00dca6d`; era `3d17cfc` — registro corregido
- Final: minor (deferred): ningún test cubre «sin `--motivo` responde motivo no válido» (spec, delta ADDED 1, último AND); el smoke lo ejecutó de verdad y responde bien
