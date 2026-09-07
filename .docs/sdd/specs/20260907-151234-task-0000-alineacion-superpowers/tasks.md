---
id: 20260907-151234-task-0000-alineacion-superpowers
title: Tasks — Alineación del kit con superpowers 6.3.0
spec: ./spec.md
plan: ./plan.md
created: 2026-09-07
---

# Tasks — Alineación del kit con superpowers 6.3.0 (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (rama única del kit, `tech-stack.md`)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Documentos del kit: versión validada, Art. V y referencias de vigilancia | pending | — | Sin Art. I |
| 2 | RED: campaña de cuatro escenarios con superpowers 6.3.0 real | pending | — | E1 bounded · E2 spike · E3 restricciones · E4 SDD |
| 3 | Implementación condicionada al RED | pending | — | Solo los escenarios que fallen |
| 4 | GREEN y refactor | pending | — | Solo los escenarios que fallaron en RED |

## Verificación por task

- [ ] Task 1 — `grep -rn "6\.3\.0"` solo en README (y constitution); relectura de los tres ficheros
- [ ] Task 2 — tres ficheros RED con verificación en disco y citas a posteriori
- [ ] Task 3 — frontmatter YAML válido en las skills tocadas
- [ ] Task 4 — veredicto por fallo del RED en cada GREEN

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
