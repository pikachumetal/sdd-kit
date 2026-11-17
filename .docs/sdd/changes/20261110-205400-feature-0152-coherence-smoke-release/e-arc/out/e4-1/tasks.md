---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 481bfa7 | |
| 2 | Listado de canceladas | done | 383cc1f | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 383cc1f

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 Important + 1 Minor sobre este fichero (ninguno toca código)

Final: fixed Task 1 con el commit de Task 2 en la tabla — ahora 481bfa7, suite 5/5 unitarios + 7/7 E2E
Final: Ruling: el ruling de `--test-concurrency=1` no se aplicó — el gate de cierre corrió como lo declara `operations.md`, sin la opción, y pasó 5/5; la carrera sobre el almacén no se reprodujo (cada fichero de test corre en su proceso), y la dependencia real es de orden dentro de `test/cancel.test.js`, que va a «Por triar» — coste si está mal: el test `canceladas` falla si alguien reordena o aísla los tests
Final: minor (deferred): la línea del ruling repite «Ruling:» bajo el encabezado `## Rulings`

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
