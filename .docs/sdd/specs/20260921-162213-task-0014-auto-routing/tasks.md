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
| 4 | Campaña GREEN | done | 5dee9f9 | 17 sujetos, 3,58 $; criterio de la decisión 4 cumplido |
| 5 | Evidencia en `tests/` y README | done | 0584d31 | En línea |
| 6 | Escalada a `using-sdd` | skipped | — | No hizo falta: el GREEN cumple la decisión 4 de la spec |

## Verificación por task

- [x] Task 1 — 4 sujetos leídos en disco: `git status` muestra la edición y `*.skills.txt` vacío
- [x] Task 2 — suite Pester en verde, salida del hook con y sin `.docs/sdd/`, revisión de task limpia
- [x] Task 3 — suite en verde, `claude plugin validate --strict` incluido
- [x] Task 4 — criterio de la decisión 4 de la spec leído de `*.skills.txt`, y router visible en el `hook_response`
- [x] Task 5 — suite en verde, README y evidencia commiteados

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| El test del hook daba 1 verde falso y 2 rojos de ejecución | `Get-Content` sin `-ErrorAction Stop` no falla y el recuento de palabras daba 0; `bash` del PATH es el lanzador de WSL, sin distribución | Corregido en el test y en el plan antes de despachar (desvío del plan, Task 2 Step 2) | 4707dbe |
| `hooks.json` anteponía un `bash` literal al comando además de `"shell": "bash"` (lo destapó la pregunta del dev-lead por `run-hook.cmd`, después de la revisión final) | Segunda resolución de `bash` por PATH, que en esta máquina es el lanzador de WSL; no fallaba porque Claude Code resuelve `shell` a Git Bash y su PATH interno prioriza su `bin/` | El dev-lead eligió quitar el `bash` redundante en lugar de copiar el wrapper; test nuevo, hook verificado desde PowerShell y Git Bash y 7 sujetos repetidos sin cambios; revisado aparte porque era un fix en línea | c544031 |
| Tras `c544031`, `session-start` se ejecuta por ruta y estaba en 100644 (Critical del revisor del fix en línea) | Sin `bash` delante hace falta el bit de ejecución; en Linux y macOS daría «Permission denied», en Windows Git Bash lo ignora. Los tests de conducta invocaban `bash script`, no el comando real | `chmod +x` en git, test que exige 100755 y tests de conducta con el `command` de `hooks.json`; re-revisión: 4 de 4 hallazgos resueltos | 896dd50 |
| En Codex, `using-superpowers` entra antes que el kit | Codex no ejecuta el hook de Claude Code; superpowers gana allí con la `description` de su skill y `"hooks": {}` en `.codex-plugin` | Fuera de scope: a la tabla de deuda del roadmap por decisión del dev-lead | 034aa60 |
