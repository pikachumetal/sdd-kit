---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0507cc7 | |
| 2 | Listado de canceladas | done | 08d29fb | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js` → `ℹ fail 0`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Task 1: Ruling: no añado .gitignore (node_modules y .temp quedan sin versionar, no se stagean) — fuera del plan — coste: ruido en git status si alguien hace add -A
Final: Ruling: zod para un enum de tres valores es desproporcionado (Arquitectura minor) — la spec aprobada por el dev-lead lo manda en Approach; se mantiene — coste si se equivoca: dependencia innecesaria, sustituible por includes en un patch
Final: Ruling: sigo sin .gitignore (Arquitectura minor 5 / Spec) — fuera del plan; los commits se stagean por ruta — coste: git add -A subiría node_modules
Final: minor (deferred): motivo duplicado en reasonSchema e INVALID_REASON
Final: minor (deferred): --motivo repetido o antes de los posicionales no se trata
Final: minor (deferred): tests de cancel.test.js dependen del orden; Motivo_no_valido_no_cancela solo mira el mensaje
Final: minor (deferred): sin test de que canceladas excluye anuladas
Final: minor (deferred): architecture.md dice Node 22 y engines >=20; la línea perdió la política de dependencias
Final: minor (deferred): CRLF→LF en test/cancel.test.js y package.json en una línea

revisado en el hilo: 5cc9f90 · .docs/sdd/steering/operations.md, tasks.md · 14 líneas

## Revisión final

Revisión final: Spec opus+high, limpia (3 minor) · Código sonnet+high, limpia (minors) · Arquitectura opus+high, con arreglos (1 important), sobre 08d29fb
Pasada de fix: ver commit siguiente, 1 hallazgo (documental, sin test que lo reproduzca; suite 8/8)
