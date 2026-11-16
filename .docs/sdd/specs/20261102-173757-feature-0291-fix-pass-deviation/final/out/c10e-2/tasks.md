---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | fb2bcfd | |
| 2 | Listado de canceladas | done | 07b9625 | |

Revisión final: Spec opus+high, listo para merge (1 Minor) · Código sonnet+high, con arreglos (1 Important, 1 Minor) · Arquitectura no (plan), sobre 07b9625
Pasada de fix: 59f0765, 3 hallazgos RED→GREEN (1 Important, 2 Minor por review.minors: fix)
Re-revisión: 07b9625..59f0765, sdd-kit:effort-high + opus, 3/3 ADDRESSED, sin roturas nuevas

## Rulings

Final: Ruling: THEN de canceladas «—» → « - » — la decisión con el dev-lead de la spec fija « - » (cp850) y el THEN la contradecía; enmienda sin aprobar en «Enmiendas» — si me equivoco, un cambio de un carácter en código, test y spec
Final: minor (deferred): el test del recorte usa Sur mar (sin reserva) y no comprueba la salida de éxito con espacios
Final: minor (deferred): cancelBooking exportada no recorta; solo recorta run (hoy nadie más la llama)
