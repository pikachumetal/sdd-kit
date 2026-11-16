---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 2f462ed | |
| 2 | Listado de canceladas | done | 2f462ed | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre 2f462ed
Pasada de fix: 3745226, 1 hallazgo RED→GREEN
Re-revisión: 2f462ed..3745226, sdd-kit:effort-high + opus, 2 Important

Sin revisar: 6c1ef32 — cancelar con --motivo sin valor responde «motivo no válido» en vez de lanzar TypeError (1 sin revisar; la re-revisión no abre otra)

## Rulings

Final: Ruling: canceladas sin canceladas responde una línea vacía (re-revisión, Important fuera de las líneas de la pasada) — la spec no fija ese caso y darle texto añade un THEN y cambia la salida observable, que es decisión del dev-lead — si me equivoco, quien lo use no distingue «ninguna» de un fallo hasta que se añada el texto
