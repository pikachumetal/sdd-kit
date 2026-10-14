---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0127a2f | |
| 2 | Listado de canceladas | done | 0127a2f | |


Revisión final: Spec opus+high, listo para mergear · Código sonnet+high, con 1 Important (corregido) · Arquitectura no (plan), sobre 0127a2f
Pasada de fix: 5faddcf, 1 hallazgo RED→GREEN
Re-revisión: 0127a2f..5faddcf, sdd-kit:effort-high + opus, todos los hallazgos resueltos

## Rulings

(ninguno)

## Deferred minors

- El test de `canceladas` depende del orden respecto al de `cancelar` (`test/cancel.test.js:13`).
- `cancelBooking` exportada no recorta el motivo; solo la CLI (`reasonOf`) lo hace.
