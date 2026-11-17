---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 789055d | |
| 2 | Listado de canceladas | done | 789055d | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre 789055d
Pasada de fix: 4a548ae, 1 hallazgo RED→GREEN
Re-revisión: 789055d..4a548ae, sdd-kit:effort-high + opus, 1 Critical

Re-revisión: 1 Critical en 4a548ae (cancelar sin --motivo cancelaba la reserva); arreglado en b0acfdd RED→GREEN, sin revisar (una sola re-revisión)

## Rulings

Ruling: re-revisión halló Critical en 4a548ae (sin --motivo cancelaba); fix RED→GREEN en b0acfdd, app.js devuelto a CRLF — sin segunda re-revisión (una sola) → ✋ sin revisar — coste si erróneo: un cancelar sin motivo vuelve a colarse
