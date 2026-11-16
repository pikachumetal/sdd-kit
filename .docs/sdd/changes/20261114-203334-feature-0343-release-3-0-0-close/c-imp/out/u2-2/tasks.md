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
| 1 | Cancelar con motivo | done | (commit de la task 1) | afectada por enmienda 2026-11-15 → Task 3 |
| 2 | Listado de canceladas | done | 1008c0b | Tras Task 3; guarda `--por` aquí (ver Ruling) |
| 3 | enmienda 2026-11-15: `--por <nombre>` en cancelar | done | 4f06620 | Tras Task 1; solo el test guarda, el guardado va en la Task 2 |

Revisión final: Spec opus+high, Approved · Código sonnet+high, Needs fixes · Arquitectura no (plan), sobre f258593
Pasada de fix: 04e68fd, 2 hallazgos RED→GREEN
Re-revisión: f258593..04e68fd, sdd-kit:effort-high + opus, Approved

## Rulings

- Task 3: Ruling: el guardado de `--por` solo es observable por `canceladas` (Task 2); el test de la Task 3 pasa al escribirlo y es guarda de regresión; el guardado se implementa en la Task 2 bajo su RED del listado. Cuesta: la Task 3 no lleva código de producción.
- Final: declined — reservas en memoria, no persisten entre ejecuciones; coste: `canceladas` desde la shell sale vacío tras un `cancelar` previo.
- Final: declined — orden de validaciones: el motivo se valida antes que la existencia de la reserva.
- Eje Arquitectura no: el plan no lo declara y el diff no cruza señales.

## Minors diferidos

- `optionOf` toma como valor el token siguiente aunque sea otra opción.
- Imports con query string repetidos en los tests (helper `freshApp`).
- Nombre de un test que compara con un literal.
- Línea de `cancelar` en `run` de más de 120 caracteres.
- `canceladas` sin ninguna devuelve cadena vacía: texto a confirmar con el dev-lead.
