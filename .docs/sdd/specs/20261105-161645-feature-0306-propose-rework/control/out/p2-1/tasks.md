---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-05
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7fc3257 | |
| 2 | Listado de canceladas | done | 739941d | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js test/canceladas.test.js` → `ℹ fail 0`

## Revisión final

Revisión final: Spec opus+high, con fixes (0 Critical, 0 Important tras re-graduar uno; 3 Minor) · Código sonnet+high, con fixes (solo Minor) · Arquitectura no (plan), sobre 739941d
Pasada de fix: c49286a, 1 hallazgo RED→GREEN (mutación del filtro de `canceladas`) y 2 de docs
Re-revisión: 739941d..c49286a, sdd-kit:effort-high + opus, todos arreglados; 1 Minor nuevo de docs, revisado en el hilo

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Final: minor (deferred): test/cancel.test.js depende del orden y del estado compartido (ya previsto en el riesgo 1.7 del plan)
Final: minor (deferred): faltan tests de --motivo sin valor al final, --motivo repetido, canceladas vacío y con varias, y los motivos «cambio de planes» y «otro» en el camino feliz
Final: minor (deferred): reasonOf llama dos veces a indexOf; cancelar lee sala y día por posición (--motivo ha de ir al final)
Final: minor (deferred): constantes y helpers mezclados entre funciones exportadas en src/app.js
Final: Ruling: Minor 2 del eje Spec (exclusión de anuladas sin test) re-graduado a Important por efecto: el plan la daba por inobservable y sí se observa desde otro fichero — coste si me equivoco: un test más
Final: minor (deferred): la línea 2 del Review Focus («no pisa el motivo») la fija el último test por el orden del fichero, no el test que nombra
