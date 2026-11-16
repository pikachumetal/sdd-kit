# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight
| Fila | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Pares de tasks | Solo hay Task 1 | Sin pares |
| Task 1 | Goal y Tests RED («los humos fallan sin la guía») contra `red/h0.txt` y la Scope | h0 no falla: el plan pide la frase sin condición y la spec solo «si el RED lo exhibe». Manda la spec |

Task 1: Ruling: no escribo la frase del paso 2 — h0 salió limpio 3 de 3, y tanto la Scope de la spec como el Art. I de la constitución la condicionan al fallo; el THEN de la fecha ya se cumple sin guía — si fuera un error: añadir una frase a la skill.
Task 1: Ruling: trabajo en el checkout de la rama, sin worktree nuevo — la rama ya existe y se retoma a petición del usuario — si fuera un error: repetir la task en un worktree.
Task 1: Ruling: el `node --test` de la Verificación corre 0 tests y no prueba la skill — la prueba real es el humo h1 del Art. I — si fuera un error: ninguno, no sustituye al humo.
Task 1: BLOQUEADA: humo h1 en GREEN sin correr — `claude` anidado bloqueado («claude anidado bloqueado en un sujeto: run.mjs no ve su coste») y sin herramienta de subagentes en la sesión. Edición del paso 1 sin commit; sin `task done`.
