---
id: <yyyyMMdd-HHmmss>-task-<id>-<slug>
title: Tasks — <título de la spec>
spec: ./spec.md
plan: ./plan.md
created: <YYYY-MM-DD>
---

# Tasks — <título> (registro vivo)

> Registro **vivo** de la ejecución del plan: se crea ANTES de empezar a implementar y se
> actualiza (status + commit) al cerrar cada task. La lista de todos del harness es efímera;
> **este fichero es el registro durable**. Solo se crea si el plan tiene más de una task.
> Borra los bloques de ayuda (`>`) al redactar.

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/<ticket>`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | <nombre> | pending | — | |
| 2 | <nombre> | pending | — | |

## Verificación por task

- [ ] Task 1 — build verde + verificación según la política del proyecto
- [ ] Task 2 — …

## Fixes adicionales (trabajo descubierto fuera de scope)

> Si durante la ejecución aparece un bug o scope no previsto en la spec: decidir con el
> usuario (arreglar ahora vs ticket aparte; misma rama vs rama nueva). Antes de proponer el
> fix: `superpowers:systematic-debugging` (causa raíz). Registrarlo aquí y en el walkthrough.
> No inflar el scope original en silencio.

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
