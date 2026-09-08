---
id: 20260908-135025-task-0000-entorno-por-worktree
title: Tasks — Entorno por worktree
spec: ./spec.md
plan: ./plan.md
created: 2026-09-08
---

# Tasks — Entorno por worktree (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (el kit es de rama única)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Campaña RED (E1–E4) | in_progress | — | Fixture "Ledgerly-env" con stubs que dejan rastro; `e1`/`e3` con worktree real |
| 2 | Plantilla `environments-template.md` | in_progress | — | **Por despacho** (Sonnet, effort medium): primera task del kit implementada por agente, en paralelo con el RED |
| 3 | Guidance reclamada por el RED | pending | — | Solo lo que falle; la fila del override se corrige en todo caso |
| 4 | GREEN + A/B de las 5 skills | pending | — | Control ya extraído de `f0360eb`; 16 copias montadas |
| 5 | Cierre documental | pending | — | Roadmap T4 + decisión pendiente resuelta |

## Verificación por task

- [ ] Task 1 — rastro en `.tools/env-log.txt` y `.sdd-env.json` verificado en disco por copia
- [ ] Task 2 — plantilla contiene marcador (3 campos), 3 entradas, 2 tipos de entorno, `env:clean` antes de borrar, idempotencia, cita a Alybo sin código; fila en `sdd-templates/SKILL.md`
- [ ] Task 3 — gates y racionalizaciones intactos; `grep -rn "no gestiona worktrees" skills/` vacío
- [ ] Task 4 — GREEN de lo que falló en el RED; A/B 5 skills sin degradación
- [ ] Task 5 — `grep -rn "environments.md" skills/ .docs/sdd/*.md` coherente

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| `tests/sdd-end-patch-*.md` no existen: la evidencia sigue con el nombre `sdd-end-hotfix-*` del rename de v0.4.0 | El rename hotfix→patch no renombró los ficheros de evidencia | Fuera de scope; anotar en el walkthrough para un patch de nombres | — |
