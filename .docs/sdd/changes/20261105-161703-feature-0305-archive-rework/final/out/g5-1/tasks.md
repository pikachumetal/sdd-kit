---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7740a13 | |
| 2 | Listado de canceladas | done | a33fd76 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre a33fd76
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 Important en este fichero (commit de la fila 1 y ruling del gate), corregidos en el cierre

## Rulings

- Task 2: Ruling: se planteó `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén compartido en memoria — no se aplicó: ningún gate del repo lo lleva (`gate.json`, constitution, plan) y no hay carrera entre ficheros (cada uno corre en su proceso); la causa real es que el test `canceladas` depende de la cancelación del test anterior en `test/cancel.test.js` — sin workaround que registrar; la dependencia de orden va a la deuda — coste si es erróneo: ninguno, el gate corre como lo declara la constitution
