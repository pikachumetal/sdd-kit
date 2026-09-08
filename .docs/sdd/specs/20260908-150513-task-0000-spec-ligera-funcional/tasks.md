---
id: 20260908-150513-task-0000-spec-ligera-funcional
title: Tasks — Spec ligera y funcional/ vivo
spec: ./spec.md
plan: ./plan.md
created: 2026-09-08
---

# Tasks — Spec ligera y `funcional/` vivo (registro vivo)

- **Spec**: `./spec.md` · **Plan**: `./plan.md` · **Rama**: `master`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Campaña RED (E1–E4) | done | `c1aea79` | Fixture Bookline-fn con `funcional/pedidos.md` y spec ligera |
| 2 | Plantillas `spec-template` y `funcional-template` | done | `29d9123` | Por despacho, en paralelo con el RED |
| 3 | Rename + guidance reclamada | done | `48c0f4a` | Rename en todo caso (Art. IV). **El RED no reclamó ninguna guidance**: E1 3/3 fusiona sin paso, E2 lee la capacidad, E3 no vuelca, E4 la plantilla basta |
| 4 | GREEN + A/B (6 skills) | done | `d5b0e35` | Sin GREEN de conducta (nada falló); A/B 22 runs, 6/6 sin degradación |
| 5 | Cierre documental + dogfooding `funcional/flujo-de-task.md` | done | pendiente | El paso de fusión lo escribe, no a mano |

## Verificación por task

- [x] Task 1 — diff de `funcional/pedidos.md` antes/después; ficheros nuevos en `funcional/`; `funcional.md` en E3
- [x] Task 2 — la spec de esta task se reescribe con la plantilla sin perder nada; `MODIFIED (antes: …)` por título estable
- [x] Task 3 — `grep -rn "funcional\.md" skills/ .docs/sdd/*.md` vacío; gates intactos
- [x] Task 4 — GREEN de lo que falló; A/B 6/6
- [x] Task 5 — `ls .docs/sdd/funcional/` = exactamente `flujo-de-task.md`, con los 7 requisitos

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
