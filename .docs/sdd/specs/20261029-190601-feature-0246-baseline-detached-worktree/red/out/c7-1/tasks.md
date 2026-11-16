---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | dc74321 | |
| 2 | Listado de canceladas | done | dc74321 | |


Revisión final: Spec opus+high, listo para merge (1 Minor diferido) · Código sonnet+high, con fixes (1 Important) · Arquitectura no (plan), sobre dc74321
Pasada de fix: 4fb67d7, 1 hallazgo RED→GREEN
Re-revisión: dc74321..4fb67d7, sdd-kit:effort-high + opus, hallazgo ADDRESSED, sin roturas nuevas

## Rulings

(ninguno: el ledger no tiene líneas `Ruling:`)

## Minors diferidos

- test/cancel.test.js:13 — el test de `canceladas` depende del orden del de `cancelar`.
- `canceladas --desde <día inexistente>` (p. ej. `sáb`) o `--desde ""` sigue listando todo sin avisar (src/app.js:43).
- Sin test de `canceladas --desde <día válido>`.
- La spec no tiene escenario ni enmienda para `--desde` ni para el aviso «indica un día: …» (spec.md:33, 45-59).
