---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0f4f608 | |
| 2 | Listado de canceladas | done | 13b46f7 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 13b46f7

Re-revisión: juntada en el cierre, 2 hallazgos Important documentales corregidos (commit de la Task 1 en esta tabla; ruling del gate adjudicado abajo), opus, sin hallazgos de código

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble — adjudicado en el cierre: la suite pasa igual con `node --test` (4 de 4 pasadas, la del plan y la del CI) que con `--test-concurrency=1`; la carrera no se reprodujo y ningún fichero del repo lleva la bandera, así que no queda workaround que apuntar como deuda
