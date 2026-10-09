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
| 1 | Cancelar con motivo | done | 6d8f528 | |
| 2 | Listado de canceladas | done | 0a58daa | listado con sala, día y motivo |
| 3 | Enmienda 2026-10-09: `--por` y quién cancela | done | d9679a1 | aprobada por Laura |

Revisión final: general-purpose + sonnet (effort: no disponible en este harness, hereda el de la sesión), con hallazgos (0 Critical, 1 Important rechazado, 3 Minor diferidos), sobre d9679a1

## Rulings

Sin rulings
- Important «test de canceladas depende del anterior»: rechazado. Reproducido aislado con --test-name-pattern: pasa (su propio cancelar cancela Norte lun). No se toca el código.
- Minor diferidos, fuera de la spec: --por sin valor o seguido de otra opción se guarda tal cual; canceladas sin cancelaciones imprime una línea vacía; el truco ?por en los imports.
- La enmienda de --por (aprobada por Laura el 2026-10-09) entró como Task 3 al final.
