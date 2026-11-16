---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 1b285ae | |
| 2 | Listado de canceladas | done | 0127a2f | |


Revisión final: Spec opus+high, listo para mergear · Código sonnet+high, con fixes (1 Important), sobre 0127a2f
Pasada de fix: c72541d, 1 hallazgo RED→GREEN
Re-revisión: 0127a2f..c72541d, sdd-kit:effort-high + opus, hallazgo resuelto (1 minor nuevo, diferido)

## Rulings
Final: minor (deferred): test/cancel.test.js — el test de `canceladas` depende del orden de los tests (estado compartido)
Final: minor (deferred): test/cancel.test.js:17 — el test del motivo con espacios solo comprueba que no sea «motivo no válido», no la cancelación (estado compartido entre tests)
