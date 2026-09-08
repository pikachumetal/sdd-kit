---
id: 20260908-095857-task-0000-workflow-ejecucion
title: Tasks — Workflow y ejecución
spec: ./spec.md
plan: ./plan.md
created: 2026-09-08
---

# Tasks — Workflow y ejecución (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (el kit es de rama única)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Campaña RED | done | `371a786` | 7 runs. Respalda F1 delegación, F2 modelo, F3 code-review, F4 herencia. Recorta el TDD (el baseline ya lo hace). R1/R2 fundidos; R3 y R4 rehechos por defecto de montaje |
| 2 | Escribir la guidance reclamada | done | `0bbb74f`, `96dc2a7` | Art. IX nuevo (regla de tres del dev-lead) corrigió dos cosas ya escritas: política de modelos = la de superpowers; code-review condicionado al camino en línea. Effort añadido al campo `Modelo` |
| 3 | GREEN + A/B de no-regresión | done | pendiente | 12 runs. F3 ✅, F4 ✅ en lo medible, A/B 4/4 y 1/1 limpios. **F1/F2 no medibles**: un subagente de workflow no puede despachar subagentes → GREEN por dogfooding |
| 4 | Cierre documental | pending | — | Roadmap T3 con el estado real: "escrito, verificado en parte, dogfooding pendiente" |

## Verificación por task

- [x] Task 1 — baseline verificado en disco (JSDoc 0/2, rama, ficheros); evidencia con racionalizaciones textuales y positivos
- [x] Task 2 — gates ⛔ (3) y racionalizaciones (9/5) intactas; `grep executing-plans skills/` vacío; Art. IX al final de la constitution
- [x] Task 3 — JSDoc 3/3, review invocada en `t-et`, ocho A/B idénticos; limitación de método documentada
- [ ] Task 4 — `grep -n "subagent-driven" .docs/ skills/` coherente

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Un subagente de workflow no tiene tool de despacho | Limitación del harness, no del kit | Registrar en T9 del roadmap; GREEN de F1/F2/F4 por dogfooding | Task 4 |
