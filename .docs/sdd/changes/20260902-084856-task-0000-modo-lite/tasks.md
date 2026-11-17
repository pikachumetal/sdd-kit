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
| 1 | RED: baseline sin guidance | done | 8b9b8b2 | 2/2 omiten brainstorming; gates aguantan |
| 2 | Guidance del modo lite en `sdd-start-task` | done | 70fdd74 | +F1 (invocación de brainstorming), sin red flags de gates |
| 3 | Plantilla de spec con marcadores de modo | done | e1b0c14 | 9 plantillas, sin duplicar |
| 4 | Cierre consciente del modo en `sdd-end-task` | done | f338103 | |
| 5 | GREEN: verificación de la guidance | done | bcc7200 | F1 y F2 reparados; REFACTOR de plantilla incluido |

## Verificación por task

- [x] Task 1 — evidencia verificada en disco, no por autoinforme del subagente
- [x] Task 2 — frontmatter válido, naming del Art. IV intacto, racionalizaciones citadas del RED
- [x] Task 3 — `templates/` sigue con 9 ficheros (Art. VIII), frontmatter de ejemplo parsea
- [x] Task 4 — checklist de cierre completo en modo full, smoke intacto en lite
- [x] Task 5 — veredicto por cada fallo del RED; huecos propios documentados y re-verificados

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| 2/2 agentes del RED omiten `superpowers:brainstorming` y redactan la spec tras explorar el código por su cuenta | El paso 4 nombra la skill dentro de una frase que describe una actividad; se lee como glosa, no como invocación (fallo de forma, Art. II) | Arreglar en esta task (decisión del usuario, 2026-09-02): paso 4 redactado como invocación inequívoca. Registrado en la spec §4.8 | Task 2 |
