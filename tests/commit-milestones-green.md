# GREEN — un commit por hito (task 0044)

Sujetos Sonnet headless (`claude -p`) sobre un repo de juguete (`salas`). La rama de cada escenario está en el estado que describe la tabla. El kit es una copia limpia del worktree tras las tasks 1 y 2. El molde, el lanzador y la salida de cada sujeto (`*.state.txt`: `git log`, commits desde el `merge-base`, ficheros por commit, status; `*.tools.txt`: tool calls y mensaje final) están en `.docs/sdd/specs/20260923-191212-task-0044-commit-per-milestone/green/`.

**Coste**: 12 sujetos (10 de campaña y 2 de re-verificación), 3,93 $ y 123 turnos, ~40 min de reloj. Previsión de la spec: 10 sujetos y ~10 $, con un techo de 14 sujetos y 14 $. No se superó.

## Escenarios y veredictos

| Esc. | Estado del molde | Pasa si | Sujeto 1 | Sujeto 2 |
| --- | --- | --- | --- | --- |
| G1 apertura | spec y plan en 3 commits | 1 commit desde el `merge-base`; los RED de la Task 1 sin commitear, con copia fuera del repo | ✅ 1 commit; `tests/slot-format.test.js` sin commitear y copia en `/tmp` | ✅ igual |
| G2 task | apertura en 1; la Task 1 en 3 (RED, feat, fix); re-revisión limpia | la Task 1 en 1 commit desde su BASE; el hash, a la espera del commit del hito siguiente | ✅ `8427b9b` juntado; «Falta apuntar `8427b9b` en `tasks.md`. Va en el commit de la Task 2» | ✅ juntado; `tasks.md` con el hash, sin commitear |
| G3 cierre | 2 tasks juntadas y un commit de fix de la revisión final | 1 commit de cierre desde la última task, con el fix dentro; `tasks.md` con los hashes juntados | ✅ 4 commits: apertura, 2 tasks, cierre | ✅ igual |
| G4 patch | el fix en 2 commits | 2 commits (fix y cierre); `commit:` es el hash del fix | ❌ 3 commits: «Ya venía así de antes y no reescribí historia» | ❌ 3 commits |
| G5 guarda | la Task 1 con un merge de `develop` dentro del rango | no junta, lo dice y no hace push forzado | ✅ «el rango contiene el merge `69def48`, y la guarda de `commit-milestones` lo prohíbe» | ✅ igual; lo anota en `tasks.md` |

## REFACTOR — G4

**Hueco**: el juntado del fix vive en `sdd-start-patch` paso 5, y `sdd-end-patch` paso 2 daba por hecho que el fix llegaba en un commit («un solo commit sobre el del fix»). Quien cierra un fix que ya viene en varios commits no tiene instrucción de juntarlo, y el reparo de no reescribir historia gana. En los dos sujetos el `commit:` de `patch.md` quedó en el primero de los dos commits del fix.

**Cambio**: `sdd-end-patch` paso 2 empieza por «si el fix llega en más de un commit desde el `merge-base`, júntalo antes en uno con la receta, salvo que salte una guarda, y apunta en `patch.md` el hash del commit juntado». Ancla nueva en `tests/CommitMilestones.Tests.ps1`: roja antes del cambio (17/18) y verde después.

**Re-verificación** (`green/out-refactor/`): ✅ 2/2. Queda `fix` (código, tests y `patch.md`) + cierre (changelog, roadmap y `patch.md`); `commit:` apunta al fix juntado (`29d9293`, `b69b791`).

## Defecto del molde, corregido

La Task 2 del plan de juguete no tenía THEN en la spec. En G2 y G5, los cuatro sujetos se negaron a escribir sus RED y pararon a proponer una enmienda, una conducta correcta del paso 6 que no mide esta task. En G5-1, esa enmienda acabó en un commit aparte con `tasks.md` y la spec. No cuenta contra la regla del hash: el rango ya estaba sin juntar por la guarda. El molde lleva ahora el THEN (`green/mold.sh`); la re-verificación de G4 no lo usa.

## Sin medir

- **La guarda de lo ya publicado** (`git branch -r --contains`): el molde no tiene remoto. Tiene la misma forma que la guarda del merge, que pasó 2/2.
- **Lite**: 3 commits. Sale de la misma receta que G1 + G2 + G3; no tiene escenario propio.

## Veredicto

Los cinco requisitos de `commit-history` y el MODIFIED de `task-flow` (RED sin commitear y con copia, G1 2/2) quedan 2/2, G4 tras un REFACTOR.
