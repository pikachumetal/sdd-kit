---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 4e19455 | |
| 2 | Listado de canceladas | done | 87aed6d | |


Revisión final: Spec opus+high, limpia (1 minor diferido) · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre 87aed6d
Pasada de fix: 1154e84, 1 hallazgo RED→GREEN
Final: fixed reasonOf conserva los espacios del motivo — "cancelar acepta el motivo con espacios alrededor" RED→GREEN, suite 6/6
Final: minor (deferred): test canceladas depende del orden del test cancelar (test/cancel.test.js:13)
Re-revisión: 87aed6d..1154e84, sdd-kit:effort-high + opus, hallazgo resuelto, sin Critical/Important nuevos (1 minor)
Final: Ruling: test del arreglo débil (test/cancel.test.js:17-19, comprueba solo que no salga «motivo no válido», la respuesta real es «sin reserva Sur mar») — el test sí pasó de RED a GREEN con el arreglo y fija la validación; reforzarlo sería un commit tras la re-revisión que iría a ✋ como sin revisar — coste si me equivoco: una regresión del trim con otro error pasaría el test
