---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 85af88d | corregido en el cierre: la tabla decía fe70a80, que es el commit de la Task 2 |
| 2 | Listado de canceladas | done | fe70a80 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre fe70a80
Revisado en el hilo: este fichero, 17 líneas, solo documentación (el commit de la tabla y la revisión); sin re-revisión.

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
