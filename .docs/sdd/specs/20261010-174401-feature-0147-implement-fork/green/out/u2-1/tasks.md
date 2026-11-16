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
| 1 | Cancelar con motivo | done | 5998c16 | afectada por enmienda 2026-10-10 → Task 3 |
| 2 | Listado de canceladas | done | 46ed9a8 | ejecutada tras la Task 3 |
| 3 | Enmienda 2026-10-10: `--por` en cancelar | done | 8848cb5 | |

Revisión final: sdd-kit:effort-high + opus, Needs fixes (2 Important, 7 Minor), sobre efdb648
Pasada de fix: e8e20cc, 2 hallazgos Important RED→GREEN (semilla `Sur mar` que cambiaba `libres`; test «sin reserva» recuperado) + 4 Minor resueltos

## Rulings

(El ledger del workspace no los tenía registrados; los reconstruyo aquí.)

- Task 3 antes que la Task 2 — la Task 2 lista lo que guarda la 3 — si me equivoco, un reordenamiento sin coste de código.
- `--por` opcional y «sin indicar» sin él — no romper `cancelar` sin `--por` (THEN de la Task 1) — si el dev-lead lo quiere obligatorio, cambia un THEN y la Task 1.
- `bookings` exportado desde `src/app.js` — para que los tests preparen su GIVEN — si molesta, un helper de reset solo de test.
