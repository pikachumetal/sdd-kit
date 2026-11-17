---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | df31951 | |
| 2 | Listado de canceladas | done | 0f96857 | |

Revisión final: autorevisión sin subagentes (la sesión no tiene herramienta de subagentes): Spec y Código sin hallazgos Critical ni Important; Arquitectura no (plan), sobre d3e2260

## Rulings

- Task 1: Ruling: recuperación tras corte — ledger reconstruido de git log; Task 1 no se rehace — coste si falla: re-ejecutar su Verificación
- Task 2: Ruling: añado en la Task 2 el test de «sin --motivo» que la Task 1 dejó sin cubrir — pasó de inmediato porque el código ya lo cumplía — coste si falla: un test extra

## Minors diferidos

- src/app.js cancelledBookings: sin canceladas imprime una línea vacía (la spec calla).
- test/cancel.test.js: ya no hay test de «sin reserva <sala> <día>» con motivo válido.
- test/cancel.test.js: «canceladas enseña el motivo» depende del estado compartido entre tests.
