---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | d188f20 | |
| 2 | Listado de canceladas | done | bf8ab9b | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre bf8ab9b
Re-revisión: bf8ab9b..juntada en el cierre, sdd-kit:effort-high + opus, 3 Important y 1 Minor adjudicados en Rulings

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: el gate de cierre es `node --test` (constitución), no `--test-concurrency=1`: ese flag no arregla nada, porque cada fichero corre en su proceso y lo que falla es la dependencia de orden dentro de `cancel.test.js` (el test 3 usa el estado del 1) — la suite del cierre corrió con `node --test` a secas, 5/5 — coste si es erróneo: ninguno, la suite está verde sin el flag; la dependencia de orden va a deuda
- Final: Ruling: commit de la Task 1 corregido a `d188f20` (la tabla decía `bf8ab9b`, que es el de la Task 2) — la re-revisión lo marcó Important y se arregla en el registro — coste si es erróneo: ninguno
- Final: Ruling: la ADR candidata (el motivo se guarda en la propia reserva) se escribe como ADR 0003 con `status: proposed`, no `accepted`: la sección «Términos y ADR» entró en la spec tras la aprobación y el dev-lead no la ha firmado, y el revisor duda de que cumpla los tres criterios (difícil de deshacer, sorprendente, alternativa real) — coste si es erróneo: una ADR de más que el dev-lead puede descartar
- Final: Ruling: ADR 0002 sin `### Confirmación`: se añade, porque `sdd decision check` falla sin ella y bloquea el cierre — coste si es erróneo: ninguno, solo documentación
- Final: minor (deferred): el escenario «sin `--motivo`» de la spec no tiene test en `test/cancel.test.js` (el código lo resuelve bien, verificado por ejecución real en el cierre)
