---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-18
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar pide un motivo de la lista | done | 82b9a3b | |
| 2 | El listado de canceladas enseña el motivo | done | e70329a | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

Revisión final: Spec opus+high, Ready with fixes (solo Minor) · Código sonnet+high, Yes · Arquitectura no (plan), sobre e70329a

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Final: minor (deferred): Spec — anexo de la spec dice «Se conserva» para «la reserva de otra persona no se toca» pero el código no modela personas (plan decisión 7)
Final: minor (deferred): Spec — `canceladas` sin canceladas imprime una línea en blanco; la spec no fija texto
Final: minor (deferred): Código — test/cancel.test.js aparece reescrito entero en el diff (finales de línea CRLF/LF)
Final: minor (deferred): Código — `export const bookings` solo para sembrar datos en un test
Final: minor (deferred): Código — `motivo fuera de la lista no cancela` no afirma el estado activo; lo deduce el test siguiente por orden
Final: minor (deferred): Código — sin test de `--motivo` sin valor; CANCEL_REASONS en mayúsculas frente a `rooms`
