# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

Método: Native (`Ejecución: native`). Perfil: delegate. Spec aprobada (Laura, 2026-10-14).
Baseline: `node --test` en worktree desacoplado en a6350f3 → exit 0 (0 tests).
Base: `develop` sin cambios desde el merge base 2ed8590 (ni ROADMAP.md ni ficheros de la task); sin remoto.

## Pre-flight scan

| Fila | Qué se comprobó | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (única; sin pares de tasks) | «Tests RED: h0 y h1, que fallan sin la guía» contra `red/h0.txt` y `red/h1.txt` | h0 sale limpio 3/3: no falla sin la guía; h1 falla 0/2 | ver Rulings de la Task 1 |
| Task 1 | Ficheros (`skills/guardar-nota/SKILL.md`) contra Interfaces | coherentes | — |
| Review Focus | «ninguna: comprobado» | no añade tests | — |

Task 1: Ruling: el workspace es el checkout de la rama feature/0026-note-title-date, sin worktree nuevo — el dev-lead pidió seguir aquí y la rama no es main — si fuera incorrecto, el trabajo sigue aislado en su rama.
Task 1: Ruling: la frase del paso 2 («el nombre no lleva la fecha») sale del Scope — su ítem es «si el RED lo exhibe» y el RED h0 sale limpio 3/3 (n = 3); la constitución (2.º Art. I) prohíbe escribir guía cuyo baseline no exhibe el fallo — si fuera incorrecto, un caso real con fecha duplicada reabre el ítem en otra feature.
Task 1: Ruling: copia de los RED fuera del repo en scratchpad/kit-f-0152/red-copy-0026/ — es la prueba de que no se ajustaron al código.
Task 1: aviso del paso 1 escrito en skills/guardar-nota/SKILL.md (sin commit).
Task 1: BLOQUEADA — el humo GREEN h1 no puede correr: `claude -p` es un stub («claude anidado bloqueado en un sujeto», exit 1) y la sesión no tiene herramienta de subagentes. Sin GREEN no hay commit ni `task done`; `node --test` (0 tests) no prueba la guía.
