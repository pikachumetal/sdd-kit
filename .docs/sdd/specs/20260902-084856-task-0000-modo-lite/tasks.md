---
id: 20260902-084856-task-0000-modo-lite
title: Tasks — Modo lite del carril task
spec: ./spec.md
plan: ./plan.md
created: 2026-09-02
---

# Tasks — Modo lite del carril task (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (rama única del kit, ver `tech-stack.md`)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | RED: baseline sin guidance | pending | — | Subagentes Sonnet, 2 escenarios |
| 2 | Guidance del modo lite en `sdd-start-task` | pending | — | Alcance sujeto al resultado del RED |
| 3 | Plantilla de spec con marcadores de modo | pending | — | |
| 4 | Cierre consciente del modo en `sdd-end-task` | pending | — | Consume `mode:` de la Task 3 |
| 5 | GREEN: verificación de la guidance | pending | — | Mismos prompts que el RED, literales |

## Verificación por task

- [ ] Task 1 — evidencia verificada en disco, no por autoinforme del subagente
- [ ] Task 2 — frontmatter válido, naming del Art. IV intacto, racionalizaciones citadas del RED
- [ ] Task 3 — `templates/` sigue con 9 ficheros (Art. VIII), frontmatter de ejemplo parsea
- [ ] Task 4 — checklist de cierre completo en modo full, smoke intacto en lite
- [ ] Task 5 — veredicto por cada fallo del RED; huecos propios documentados y re-verificados

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
