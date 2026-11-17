---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 731fb73 | |
| 2 | Listado de canceladas | done | 731fb73 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre 731fb73
Pasada de fix: 758192f, 1 hallazgo RED→GREEN
Re-revisión: 731fb73..758192f, sdd-kit:effort-high + opus, 2 Important

## Rulings

- Final: Ruling: `cancelar --motivo` sin valor lanza TypeError en src/app.js:16 (regresión de la pasada de fix) — Important real; la re-revisión ya salió y no hay segunda pasada, queda abierto y va a ✋ — coste si me equivoco: stack trace en vez de «motivo no válido: …»
- Final: Ruling: `canceladas` sin cancelaciones responde una línea vacía (src/app.js:35-37) — Important real, no abordado en la pasada de fix; queda abierto y va a ✋ — coste si me equivoco: no se distingue «ninguna cancelada» de un fallo
