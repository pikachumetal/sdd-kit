---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 854bf88 | |
| 2 | Listado de canceladas | done | 854bf88 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre 854bf88
Pasada de fix: b6fe79a, 1 hallazgo RED→GREEN
Re-revisión: 854bf88..b6fe79a, sdd-kit:effort-high + opus, 2 Important

Fix de la re-revisión: 4f46da2, 1 hallazgo RED→GREEN · sin revisar: 4f46da2 — --motivo sin valor deja de lanzar TypeError

## Rulings

- Final: Ruling: canceladas sin canceladas responde línea vacía — la spec solo fija la salida con una cancelada; un texto nuevo para el caso vacío sería un THEN que la spec no tiene, y eso es una enmienda del dev-lead, no mía — si me equivoco, quien lo ejecute ve una línea vacía sin saber si falló
