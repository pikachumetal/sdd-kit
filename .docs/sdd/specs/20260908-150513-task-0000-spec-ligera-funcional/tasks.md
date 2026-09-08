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
| 1 | Campaña RED (E1–E4) | in_progress | — | Fixture Bookline-fn con `funcional/pedidos.md` y spec ligera |
| 2 | Plantillas `spec-template` y `funcional-template` | in_progress | — | Por despacho, en paralelo con el RED |
| 3 | Rename + guidance reclamada | pending | — | Rename en todo caso (Art. IV) |
| 4 | GREEN + A/B (6 skills) | pending | — | |
| 5 | Cierre documental + dogfooding `funcional/flujo-de-task.md` | pending | — | El paso de fusión lo escribe, no a mano |

## Verificación por task

- [ ] Task 1 — diff de `funcional/pedidos.md` antes/después; ficheros nuevos en `funcional/`; `funcional.md` en E3
- [ ] Task 2 — la spec de esta task se reescribe con la plantilla sin perder nada; `MODIFIED (antes: …)` por título estable
- [ ] Task 3 — `grep -rn "funcional\.md" skills/ .docs/sdd/*.md` vacío; gates intactos
- [ ] Task 4 — GREEN de lo que falló; A/B 6/6
- [ ] Task 5 — `ls .docs/sdd/funcional/` = exactamente `flujo-de-task.md`, con los 7 requisitos

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
