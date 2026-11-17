# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 8978912 |
| 2 — Listado de canceladas | hecha | 2adfc23 |

## Ledger

- Task 1: complete — 8978912
- Task 2: complete — 2adfc23
- Ruling: el THEN «sin --motivo» no tenía test; añadido tras la Task 2 (el código ya lo cubría, no se vio en RED). Reconstruido a posteriori: el repo no traía ledger ni tasks.md.
- Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo ni dependencia nuevos; `reason` es un campo en memoria de la reserva) → no sale
- Final: fixed «el test de canceladas depende del orden de los tests» (Código, Important) — `canceladas enseña sala, día y motivo` solo: RED (actual '') → GREEN, suite 7/7
- Final: fixed «se perdió la cobertura de "sin reserva"» (Código Important · Spec Minor) — `cancelar sin reserva lo dice`: con la rama rota a propósito la suite seguía 6/6; ahora falla 1 → restaurada, suite 7/7
- Final: minor (deferred): `canceladas` vacío imprime una línea en blanco (Spec y Código) — cambiar la salida observable no lo pide la spec
- Final: minor (deferred): ningún test comprueba que una reserva real sigue activa tras un motivo inválido (Spec)
- Final: minor (deferred): `--motivo` sin comillas o antes de sala y día se parsea mal (Código)
- Final: minor (deferred): `--motivo` sin valor final sin test
Revisión final: Spec opus+high, con fixes (0 Critical, 0 Important, 3 Minor) · Código sonnet+high, con fixes (2 Important) · Arquitectura no (plan), sobre 7af572f
Pasada de fix: f84c758, 2 hallazgos RED→GREEN
- Final: Ruling: en la pasada de fix renombré `cancelar sin motivo` → `cancelar sin motivo pide uno de la lista` y extraje `invalidReason` en los tests — no pedido por los hallazgos; sin cambio de aserción, y ese test nunca estuvo en RED — coste si falla: ninguno
Re-revisión: 7af572f..bb9bee8, sdd-kit:effort-high + opus, Yes (0 Critical, 0 Important)
