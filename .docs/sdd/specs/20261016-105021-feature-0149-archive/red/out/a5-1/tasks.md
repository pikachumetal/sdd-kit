---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 56a3fa9 | |
| 2 | Listado de canceladas | done | 56a3fa9 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 56a3fa9
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (1 Minor diferido)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble

## Minors diferidos

- Final: minor (deferred): la fila 0016 «Fotos de las salas» cuelga de la 0009 «Cancelaciones con motivo» sin relación aparente; confirmar con el dev-lead si el hermano de la 0010 es otro id (¿0014?) — roadmap.md:9
