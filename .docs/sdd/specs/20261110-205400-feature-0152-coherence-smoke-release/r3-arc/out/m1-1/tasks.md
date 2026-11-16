---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 49ecfa8 | |
| 2 | Listado de canceladas | done | b51a961 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre b51a961
Re-revisión: b51a961..juntada en el cierre, sdd-kit:effort-high + opus, hallazgos abiertos: 2 Important de registro (commit de la Task 1; ruling del gate) y 1 Minor; los tres tratados en el cierre

## Rulings

- Task 2: Ruling (SIN EFECTO, desmentido en el cierre: ver `Final: Ruling` abajo): `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: el ruling de la Task 2 no se sostiene — `node --test` pasa 5/5 y sale verde 5 de 5 veces sin `--test-concurrency=1` (cada fichero corre en su proceso); lo que hay es acoplamiento de orden en `test/cancel.test.js` (el tercer test usa el estado del primero). El gate es el del plan, `node --test`; el acoplamiento va a la deuda — coste si está mal: ninguno, el gate del plan corrió verde
- Final: minor (deferred): `architecture.md` dice que `src/app.js` valida el motivo, una regla de negocio que ya vive en la capacidad `bookings`
