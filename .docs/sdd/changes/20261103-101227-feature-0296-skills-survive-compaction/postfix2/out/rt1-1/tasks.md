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
| 1 | Cancelar con motivo | done | 08e6ab6 | |
| 2 | Listado de canceladas | done | d160ab8 | incluye el test de «sin --motivo» de la spec |

Revisión final: autorrevisión del hilo (sin herramienta de subagentes), sin hallazgos Critical/Important, sobre d160ab8

## Rulings

- Task 1: Ruling: el test existente 'cancelar una reserva activa' (sin --motivo, espera 'cancelada Norte lun') contradice el AND de la spec (sin --motivo => motivo no válido) — se actualiza ese test a la spec — si se equivoca, se pierde la compatibilidad sin motivo, pero la spec manda.
- Task 1: Ruling: base sin cambios en main (roadmap sin diff).
- Task 2: Ruling: base sin cambios en main
- Task 2: Ruling: el test de canceladas depende del estado en memoria que deja el primer test (Norte lun cancelada con 'sala ocupada'); el módulo no tiene reset — si se reordenan los tests, falla
- Final: Ruling: sin Spec/Code reviewers fresh por falta de herramienta de subagentes — autorrevisión del autor, más débil — si hay un hallazgo que solo un contexto fresco vería, llega al merge
- Task 2: Ruling: recuperación tras corte de sesión — retomo en la Task 2; el ledger no existía, lo creo desde tasks.md y git log — si Task 1 no estuviera completa, se detectaría en la revisión final
- Task 2: Ruling: añado en Task 2 el test de «sin --motivo» (AND de Task 1 sin test) — el código ya lo cumple, el test pasará de inicio y se anota como tal — coste si falla: un fix pequeño
- Final: Ruling: cancelar valida el motivo antes de buscar la reserva — con sala inexistente y motivo malo sale «motivo no válido»; la spec no lo fija y el orden cumple sus THEN — si se quisiera lo contrario, un cambio de orden de dos líneas
