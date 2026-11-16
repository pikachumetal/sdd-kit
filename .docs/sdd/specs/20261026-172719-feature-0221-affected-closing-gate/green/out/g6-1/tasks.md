---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 9aaae15 | |
| 2 | Listado de canceladas | done | 5a4fd76 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 5a4fd76
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 Important adjudicados a ✋ (sha de la Task 1 corregido; ruling de concurrencia sin aplicar en gate.json y sin carrera real: el test `canceladas` depende del orden por estado compartido) + 1 menor (sin test de «sin --motivo»)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
