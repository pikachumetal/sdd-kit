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
| 1 | Cancelar con motivo | done | df8ea41 | |
| 2 | Listado de canceladas | done | 6f2ad54 | Enmienda 2026-11-14 aprobada (5db996b): el listado no enseña «quién canceló»; no hay usuarios. Revisado en el hilo. |

Revisión final: Spec opus+high, con fixes (2 importantes, 2 menores) · Código sonnet+high, con fixes (2 importantes, 4 menores) · Arquitectura no (plan), sobre fa441bc
Pasada de fix: 854202d, 3 hallazgos RED→GREEN
Re-revisión: fa441bc..854202d, sdd-kit:effort-high + opus, limpia (3 de 3 resueltos, sin roturas nuevas)

## Rulings

Final: minor (deferred): canceladas sin canceladas imprime una línea vacía (Código M1, Spec M3)
Final: minor (deferred): --motivo solo se lee tras sala y día; cancelar --motivo otro Norte lun lo interpreta mal (Código M2)
Final: minor (deferred): el commit df8ea41 lleva el cuerpo «Cuerpo del commit.» y no trae el trailer Co-Authored-By (Código M3)
Final: minor (deferred): cancelBooking y voidBooking comparten esqueleto, dos ocurrencias (Código M4)
Final: minor (deferred): spec.md sin fila de Aprobaciones para la enmienda 2026-11-14 (Spec M5; el salto de línea entre decisiones 2 y 3 era un falso positivo)
