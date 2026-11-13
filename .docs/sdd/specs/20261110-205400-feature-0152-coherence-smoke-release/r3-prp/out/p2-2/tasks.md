---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-11
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo de la lista | done | 66bfba8 | |
| 2 | Listado de canceladas con motivo | done | 9697424 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js` → `ℹ fail 0`

Revisión final: Spec opus+high, With fixes (solo Minor) · Código sonnet+high, Yes · Arquitectura no (plan), sobre 9697424

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Final: minor (deferred): `cancelar --motivo otro Norte lun` (motivo antes de la sala) responde «sin reserva --motivo otro»; el CLI ya es posicional
Final: minor (deferred): cambio de finales de línea CRLF→LF en test/cancel.test.js (git avisa por autocrlf; sin cambio de contenido)
Final: minor (deferred): faltan tests de `--motivo` sin valor y de motivo inválido sobre reserva inexistente
Final: minor (deferred): `canceladas` vacío imprime una línea en blanco; la spec calla y un literal nuevo sería fuera de spec
Final: Ruling: Declined to judge del eje Código (orden de comprobaciones, anuladas, módulo de REASONS) — son del eje Spec/Arquitectura; el orden y las anuladas están en el plan y su Review Focus — coste si falla: reabrir esas decisiones tras la validación
Final: minor (deferred): «reserva sigue activa» tras motivo inválido solo se fija por el orden de los tests (partial, Review Focus 1 y 2)
Final: minor (deferred): Review Focus 4 se prueba con listCancelled inyectada, no de punta a punta con `anular`
Final: Ruling: ledger sin ℹ fail 0 en las líneas de task (señalado por Spec) — el gate completo corre fresco en el hilo: ver salida — coste si falla: reabrir la task
Final: Ruling: sin pasada de fix — no hay Critical ni Important y review.minors no es fix — coste si falla: los 6 minors quedan como deuda menor
