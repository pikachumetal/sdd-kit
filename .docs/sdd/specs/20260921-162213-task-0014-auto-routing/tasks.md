---
id: 20260921-162213-task-0014-auto-routing
title: Tasks — Auto-enrutado del kit frente a superpowers
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Auto-enrutado del kit frente a superpowers (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0014`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | RED de los controles de sobre-disparo | done | 4707dbe | 4 de 4 sin skill con el kit actual; 0,61 $ |
| 2 | Hook `SessionStart` con su test | done | e514aa2 | Implementador Sonnet (el tool `Agent` no expone effort: desviación del Art. IV, effort medium no garantizado) |
| 3 | `description` y frontmatter | done | 3e4d94e | En línea |
| 4 | Campaña GREEN | done | ver commit | 17 sujetos, 3,58 $; criterio de la decisión 4 cumplido |
| 5 | Evidencia en `tests/` y README | in_progress | — | En línea |
| 6 | Escalada a `using-sdd` | skipped | — | No hizo falta: el GREEN cumple la decisión 4 de la spec |

## Verificación por task

- [x] Task 1 — 4 sujetos leídos en disco: `git status` muestra la edición y `*.skills.txt` vacío
- [x] Task 2 — suite Pester en verde, salida del hook con y sin `.docs/sdd/`, revisión de task limpia
- [x] Task 3 — suite en verde, `claude plugin validate --strict` incluido
- [x] Task 4 — criterio de la decisión 4 de la spec leído de `*.skills.txt`, y router visible en el `hook_response`
- [ ] Task 5 — suite en verde

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| El test del hook daba 1 verde falso y 2 rojos de ejecución | `Get-Content` sin `-ErrorAction Stop` no falla y el recuento de palabras daba 0; `bash` del PATH es el lanzador de WSL, sin distribución | Corregido en el test y en el plan antes de despachar (desvío del plan, Task 2 Step 2) | 4707dbe |
