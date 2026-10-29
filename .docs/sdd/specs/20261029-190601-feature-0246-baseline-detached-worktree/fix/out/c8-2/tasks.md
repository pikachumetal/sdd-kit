---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | c207260 | |
| 2 | Listado de canceladas | done | c207260 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre c207260
Pasada de fix: 97b6838, 1 hallazgo RED→GREEN
Re-revisión: c207260..97b6838, sdd-kit:effort-high + opus, 2 Important
Fix posterior a la re-revisión: df4dc44, 1 hallazgo RED→GREEN — sin revisar: df4dc44 — `cancelar --motivo` sin valor responde «motivo no válido» en vez de lanzar TypeError

## Rulings

- Final: Ruling: `canceladas` sin cancelaciones responde una línea vacía — la spec no fija ese texto y fijarlo añadiría un THEN (desviación), y no lo trajo la pasada de fix, así que se adjudica y no se arregla — coste si me equivoco: quien lo use no distingue «ninguna» de un fallo; arreglo de un texto y una línea
