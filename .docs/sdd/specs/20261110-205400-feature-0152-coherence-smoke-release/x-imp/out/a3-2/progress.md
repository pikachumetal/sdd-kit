# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

Spec: ./spec.md (approved, dev-lead Laura 2026-10-14). Perfil: delegate. Método: Native.

## Pre-flight scan

| Task | Comprobado | Hallazgo | Ruling |
| --- | --- | --- | --- |
| 1 (sola; sin pares que compartan fichero) | Tests RED (h0, h1) contra «Produce: los dos cambios» | h0 salió limpio 3/3: el cambio del paso 2 no tiene RED | ver Ruling 1 |
| 1 | «Verificación: `node --test`» contra los tests que nombra | `node --test` corre 0 tests: no ejercita h0 ni h1 | ver Ruling 3 |

Task 1: Ruling: base check — `git diff $(merge-base) develop` vacío (develop == merge-base f2e0b5d), sin ROADMAP.md ni ficheros solapados; sin remoto — sin coste
Task 1: Ruling: trabajo en sitio en la rama feature/0026-note-title-date (repo normal, no worktree enlazado; no es main) — la petición fue seguir en esta rama — si se quería worktree, el cambio es un solo fichero y se mueve con un cherry-pick
Task 1: Ruling: la frase del paso 2 («el nombre no lleva la fecha») sale del alcance — Scope la marca «si el RED lo exhibe» y h0 dio 3/3 limpios (n = 3); la constitución (Art. I, 2.º) prohíbe guidance cuyo baseline no exhibe el fallo — si se quería igualmente, es una línea en el paso 2 con su humo
Task 1: Ruling: la `Verificación` `node --test` no cubre los humos (0 tests); el GREEN de h1 exige un sujeto headless y en esta sesión `claude` anidado está bloqueado («claude anidado bloqueado en un sujeto») — la task no se marca complete con un `node --test` vacío; queda pendiente el GREEN de h1 — si se cierra sin él, el aviso entra sin prueba (Art. I)
Task 1: Ruling: el aviso del paso 1 nombra la causa del RED (los sujetos inventaron `nota`/`sin-titulo`) en vez de reformular «ask for the title» con énfasis: prohíbe el título por defecto y fija esperar la respuesta antes de escribir — si el humo GREEN falla, otra ronda de REFACTOR (Art. I)
Task 1: commit 9f8baf2 (base a62a637); `node --test` → exit 0, 0 tests; GREEN de h1 pendiente (sin sujeto headless) — sin línea complete
