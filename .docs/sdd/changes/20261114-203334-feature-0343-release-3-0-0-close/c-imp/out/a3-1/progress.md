# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan
| Fila | Qué comparé | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares) | Tests RED (h0, h1) vs Ficheros (`skills/guardar-nota/SKILL.md`) vs Scope de la spec | Coherente. h0 cubre el ítem «si el RED lo exhibe»; h1 cubre el aviso del paso 1. |
| Constitución | Dos artículos numerados «Art. I» | Duplicado de numeración; no contradicen la task. No se toca (fuera del Scope). |

Task 1: Ruling: base sin cambios en develop desde el merge-base 2f35d8f (ROADMAP.md y ficheros) — sigo.
Task 1: Ruling: trabajo en el checkout de la rama feature/0026-note-title-date, sin worktree nuevo — las salidas RED ya estaban en este árbol y la rama no es main — si fuera incorrecto, coste nulo: nada fuera de la rama.
Task 1: Ruling: el ítem «Entra, si el RED lo exhibe» (frase del paso 2) sale del Scope — h0 limpio 3 de 3 (n = 3), y la constitución (2.º Art. I) prohíbe escribir guidance cuyo baseline no exhibe el fallo — si fuera incorrecto: un humo h0 más amplio y una task de enmienda.
Task 1: Ruling: el humo GREEN h1 no se puede lanzar desde esta sesión — el `claude` del PATH bloquea sujetos anidados («claude anidado bloqueado en un sujeto: run.mjs no ve su coste», exit 1) — guía escrita y sin commit; la task no se marca complete sin el GREEN de h1 (constitución, Art. I).
