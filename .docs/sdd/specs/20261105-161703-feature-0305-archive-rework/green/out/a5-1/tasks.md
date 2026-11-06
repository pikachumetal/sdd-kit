---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | db4c22c | commit corregido en el cierre: figuraba 9382a28 |
| 2 | Listado de canceladas | done | 9382a28 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 9382a28

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 0 Critical · 1 Important (roadmap: la fila 0016 «Fotos de las salas» no encaja bajo la 0009), solo documentación, sin cambios en src/ ni test/

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: la re-revisión pide quitar la fila 0016 de la 0009 en `roadmap.md` — la partición de la 0009 en 0010 y 0016 la escribió el dev-lead en el roadmap, no es de la 0010 y no cambia lo que hace el software; no la toco — coste si es erróneo: la 0009 queda esperando una pieza que no le toca hasta que el dev-lead reparta de nuevo
