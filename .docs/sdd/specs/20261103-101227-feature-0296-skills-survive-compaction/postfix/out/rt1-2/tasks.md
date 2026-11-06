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
| 1 | Cancelar con motivo | done | 388e6b6 | |
| 2 | Listado de canceladas | done | 1d657b1 | |

Revisión final: autorrevisión del hilo (sin herramienta de subagentes): Spec sin hallazgos graves · Código sin hallazgos graves · Arquitectura no (sin línea en el plan; sin señales en el diff), sobre be44e4b

## Rulings

Task 1: Ruling: recuperación sin ledger — reconstruido desde tasks.md y git log: Task 1 hecha en 388e6b6 (base 669657c); retomo en la Task 2 — si Task 1 no estuviera completa, la Task 2 la expondría
Task 1: Ruling: sigo en la rama feature/0010-cancel-reason del checkout actual (no hay worktree aparte; no es main) — evita mover trabajo a medias — coste: ninguno si la rama es la correcta
Final: Ruling: Eje Arquitectura sin línea en el plan — decidido no por las señales del diff — si hubiera frontera nueva, nadie la habría revisado aparte
Final: minor (deferred): faltan tests de «sin --motivo» y de «sin reserva» con motivo válido (la Task 1 quitó el test de «sin reserva»)
Final: minor (deferred): canceladas sin ninguna cancelada responde una cadena vacía (línea en blanco)
Final: Ruling: Declined to judge — anulaciones (voided) fuera del listado — es el alcance de la 0011, no entra aquí — si el usuario las espera, falta una línea en el listado
Final: Ruling: Declined to judge — el estado vive solo en memoria — la 0014 guarda el motivo en el almacén — el motivo se pierde entre ejecuciones del CLI hasta entonces
