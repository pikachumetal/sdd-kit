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
| 1 | Cancelar con motivo | done | 317979f | |
| 2 | Listado de canceladas | done | c07a41f | enmienda 2026-10-10 aprobada: sin «quién canceló» |

## Rulings

- Task 2 — enmienda 2026-10-10 (aprobada por el usuario): el listado enseña sala, día y motivo; «quién canceló» sale de la spec porque la aplicación no tiene usuarios. Coste si es erróneo: añadir `--por <nombre>` en una Task 3.
- Task 2 — el test del listado depende del estado en memoria de `bookings` (mismo proceso): `canceladas` por CLI en un proceso nuevo sale vacío. Es el diseño previo de la app, no de esta feature.

## Revisión final

Revisión final: effort-high + opus, con hallazgos (0 Critical, 1 Important abierto, 4 Minor), sobre bef9be1

- Important (decisión del usuario, abierta): las reservas viven en memoria y cada comando es un proceso nuevo; `node src/app.js canceladas` sale siempre vacío. Persistir es alcance nuevo (la spec no lo pide).
- minor (deferred): `canceladas` sin canceladas imprime una línea vacía, sin mensaje.
- minor (deferred): el commit de la Task 1 sustituyó el test «cancelar sin reserva lo dice»; la rama `sin reserva …` quedó sin cobertura.
- minor (deferred): `cancelar` sin `--motivo` responde «motivo no válido…», y el motivo se valida antes de mirar si hay reserva.
- minor (deferred): el test del listado depende del estado que dejó el primer test (mismo proceso).
