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
| 1 | Cancelar con motivo | done | (commit de la task 1) | |
| 2 | Listado de canceladas | done | 627593b | enmienda 2026-10-10 aprobada (retirado «quién canceló») |

Revisión final: sdd-kit:effort-high + opus, sin Critical ni Important, sobre 627593b

## Rulings

- Enmienda 2026-10-10 (aprobada): el listado no enseña «quién canceló»; la app no tiene usuarios. Coste si es erróneo: feature aparte cuando haya identidad.
- Reservas solo en memoria: `canceladas` desde otra ejecución de la CLI sale vacío. Es del molde base; coste: sin persistencia el comando solo se observa dentro de un proceso.

## Minors diferidos

- Test «cancelar sin reserva lo dice» perdido en la Task 1 (3ba979b).
- `cancelar` sin `--motivo` responde «motivo no válido» aunque no haya reserva; sin comillas, `--motivo sala ocupada` solo coge «sala».
- `canceladas` vacío imprime una línea vacía.
- El test del listado depende del estado del primer test.
