---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261029-171433-feature-0257-release-merge-read-base-ci
task: 0257
mode: full
date: 2026-10-29
---

# Ticket para el kit — feature 0257: la release y el merge leen la CI de la base

## Contexto

- Carril y modo: feature full, perfil `delegate`, spec aprobada en el gate
- Skills del kit usadas: sdd-propose, sdd-start-feature, sdd-implement, sdd-verify, sdd-archive, add-to-changelog, sdd-feedback (leídas del working tree)
- Proyecto: el repo del kit (skills en Markdown, CLI en Node y TypeScript, Vitest, moon), un dev-lead, varias sesiones en worktrees del mismo clon
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: eje Spec y re-revisión en Opus 5.5 (effort high), eje Código en Sonnet 5.5 (effort high); 32 sujetos en Sonnet
- Coste en reloj: 0,84 h de esfuerzo frente a 2,5 h estimadas, hasta el commit de cierre; la CI de la rama sumó ~8 min antes del merge
- Coste en tokens: 33,4 M (hilo 28,7 M, subagentes 4,7 M), 13,11 $ de sesión más 8,56 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Dos filas de la rúbrica puntuadas a favor con la línea de `tools.txt` cortada

- **Qué pasó**: en REFACTOR 3, `rc2-2` corrió `gh run list … ; node --test 2>&1 | tail -8` en una sola llamada. Busqué `node --test` con `grep -n ">>> .*node --test\|>>> .*gh run" … | cut -c1-150`, y el corte escondió el `node --test` que seguía al `gh`. Di `rc2` por 2/2. Lo mismo con `ci2-2` de REFACTOR: anoté el error recortado entre paréntesis y conté K4 como 2/2. El eje Spec de la revisión final lo marcó como dos Important.
- **Fuente**: `.docs/sdd/specs/20261029-171538-feature-0257-release-merge-read-base-ci/refactor3/out/rc2-2.tools.txt:67`; el commit `ea7e29d2` corrige `tests/base-ci-green.md`; el informe del eje Spec de la sesión.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Baterías por skill» («Cada sujeto se califica con la rúbrica escrita, literal, y fila por fila»); `tests/headless/battery.mjs` solo da el veredicto de la puerta.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Una fila «`tools.txt` tiene `<comando>`» se puede comprobar con una máquina, y la puntué a ojo con un filtro que recorta.
- **Coste**: una pasada de fix con 8 sujetos (2,47 $) y dos Important en la revisión final; respaldo: `tests/base-ci-green.md` (filas REFACTOR 3 y «Pasada de fix») y el commit `ea7e29d2`.
- **Propuesta**: que `battery.md` admita, por fila de la rúbrica, una comprobación mecánica (`tools: /<regex>/` presente o ausente), y que `battery.mjs verdict` la aplique a cada sujeto sobre la línea entera. Las filas de juicio siguen a mano.
- **Verificada**: sí — `grep -n "node --test" refactor3/out/rc2-2.tools.txt` en Git Bash, sin `cut`, da la línea 67.
- **Criterio de aceptación**: GIVEN una fila K6 «`tools.txt` no tiene `node --test`» declarada como comprobación y un sujeto que lo encadena tras `gh` en la misma llamada WHEN `battery.mjs verdict` THEN el escenario sale 1/2.

### 2. La pasada de fix metió un Important que contradecía una decisión de la spec aprobada

- **Qué pasó**: un Minor del eje Código pedía aclarar si el `HEAD` del corte era el local o el remoto. Lo arreglé con `<remoto>/<merge.into>`, y eso contradice la decisión 5 de la spec («el `HEAD` de `merge.into` cuando arranca el corte, tras `git fetch`»). La re-revisión lo marcó como Important: con `merge.push: false`, la release cortaría commits locales sin suite ni CI. Lo arreglé en el hilo (`f1df0e9d`), que queda `sin revisar`.
- **Fuente**: la spec de la 0257, decisión 5; los commits `ea7e29d2` y `f1df0e9d`; el informe de la re-revisión de la sesión.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Closing the review» (pasada de fix en Native).
- **Por qué el kit no lo evitó**: la pasada de fix arregla cada hallazgo con su test, pero no pide contrastar con las decisiones de la spec cuando el arreglo elige entre dos lecturas. Es el tercer caso de una pasada de fix que mete un Important (0235 §1 y 0236 §4); la fila 0246 ya recoge «Closing the review».
- **Coste**: un commit `sin revisar` en el merge y ~5 min; respaldo: `f1df0e9d`.
- **Propuesta**: sumarlo a la 0246. Un hallazgo cuyo arreglo elige un valor (un sha, un literal, un umbral) busca ese valor en las decisiones de la spec antes de escribirlo.
- **Verificada**: sí — contrastado con la decisión 5 de `spec.md` de la 0257.
- **Criterio de aceptación**: GIVEN un Minor «no dice si es el local o el remoto» y una spec que fija el local WHEN la pasada de fix lo arregla THEN el texto dice el local.

### 3. La regla 7 publica la rama antes de juntar el cierre, y después el squash pide un force-push que el hook bloquea

- **Qué pasó**: publiqué la rama para su CI tras la pasada de fix (`ea7e29d2`), como pide la regla 7 de `CLAUDE.md`. Al juntar el cierre en un commit, como pide `commit-milestones.md`, el push necesitaba `--force-with-lease`, y el hook del dev-lead lo bloqueó: `BLOCKED: … matches dangerous pattern 'git push --force'`. Rehíce el cierre sobre `f1df0e9d`, con la pasada de fix y su arreglo como commits propios.
- **Fuente**: la salida del hook en la sesión; `git log` de la rama: `656b86a6`, `f1df0e9d`, `ea7e29d2`.
- **Dónde en el kit**: `CLAUDE.md` del repo, regla 7, frente a `skills/sdd-start-feature/references/commit-milestones.md` (cierre en un commit desde el de la última task).
- **Por qué el kit no lo evitó**: ninguna de las dos reglas dice cuándo publicar la rama respecto al squash del cierre.
- **Coste**: ~5 min y una historia con dos commits de más; sin respaldo en el walkthrough, que solo cita los shas.
- **Propuesta**: en `commit-milestones.md`, un commit ya publicado en el remoto no se junta; el cierre va encima y lo dice. O en la regla 7, publicar la rama solo después del commit de cierre.
- **Verificada**: sí — reproducido en la sesión (hook bloqueó el push).
- **Criterio de aceptación**: GIVEN una rama con la pasada de fix ya publicada WHEN el cierre junta sus commits THEN no la reescribe y el walkthrough cita los shas publicados.

## Lo que hice por iniciativa propia

- Un `gh` falso en el `PATH` del sujeto (`tests/batteries/sdd-archive/fixtures/gh/gh.mjs`, con `gh` y `gh.cmd`), que responde lo que diga `gh.json` y apunta cada llamada en `state.txt`. Funcionó en Git Bash en los 32 sujetos y sirve para cualquier escenario que lea una CI.

## Funcionó, no tocar

- La prueba en seco de los moldes (`DRY_RUN=1 KEEP_MOLD=1`) antes del RED: los cuatro moldes y el `gh` falso salieron bien a la primera.
- `sdd capability merge` sobre una copia de `.docs/sdd` antes del gate de la spec.
- La revisión final por ejes con la re-revisión única: cazó tres errores míos que el GREEN dio por buenos.

## Menores

- `SUBJECT_CAP` de `battery.mjs run` cuenta los sujetos de todas las fases de `RUNS_DIR`: el GREEN con `SUBJECT_CAP=8` lanzó 4 porque el RED ya había gastado 4 — `tests/headless/campaign.mjs`.
- Sonnet junta en una llamada la orden de la CI y la suite: hicieron falta tres rondas («córrela sola», «tal cual la declara», «en una llamada sin otra orden detrás») y una racionalización — `skills/sdd-end-release/SKILL.md`, «Gate de entrada».
