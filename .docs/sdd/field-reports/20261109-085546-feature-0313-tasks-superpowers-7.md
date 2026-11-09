---
kit_version: 2.3.4
lane: feature
id: 20261109-085546-feature-0313-tasks-superpowers-7
task: 0313
mode: full
date: 2026-11-09
---

# Ticket para el kit — feature 0313: `cli/src/tasks` al día con los scripts de superpowers 7.0.2

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-subagent`, `sdd-worktrees`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (CLI Node en TypeScript sin dependencias, skills en Markdown), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (revisores de spec, implementadores, revisores de task, eje Código, pasada de fix) y Opus 5.5 (eje Spec, re-revisión)
- Coste en reloj: 1,43 h frente a 1,5 h estimadas (sin contar el cierre posterior a la medida)
- Coste en tokens: hilo 37.942.379, subagentes 9.421.698 en 10 despachos; 21,12 $ hasta el walkthrough

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El gate de cierre dio rojo por carga de la máquina y su contraste costó ~25 min

- **Qué pasó**: el gate sobre el commit de cierre (`moon run kit:test-headless cli:typecheck cli:test --affected --base develop`, Git Bash) dio `cli:test` 2 rojos de 2371 con `Error: Test timed out in 5000ms.` y canceló `kit:test-headless`. Al relanzar `kit:test-headless` solo, dio 21 rojos de 448 en `test/kit/headless/molds.test.ts`, todos con `Error: Test timed out in 120000ms.`, en 651 s. A la vez corrían otras cuatro sesiones del repo, una de ellas en su `sdd merge --push`. Los dos ficheros de `cli:test`, solos, pasaron en la rama y en `origin/develop` (24/24 cada uno). El contraste de `molds.test.ts` en la rama y la base a la vez murió sin salida (exit 4, solo la línea `RUN`). Tras la sync, con la máquina libre, el mismo gate pasó en 93 s: 451/451 y 2361/2373.
- **Fuente**: salidas guardadas del gate (`gate.txt`, `gate-headless.txt`, `gate2.txt` en el scratchpad de la sesión); `Get-CimInstance Win32_Process` con un `sdd merge --project-root …feature-0308… --push` en curso; la fila «Intermitente: …» de «Deuda técnica» que abrió este cierre.
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md`, «A red suite», paso 2 («on the branch and in that worktree at once»); `tech-stack.md` §Testing del repo, el tope de 5 min.
- **Por qué el kit no lo evitó**: la receta lanza el contraste de la rama y la base a la vez. Con un fichero que ya da timeout por carga, como `molds.test.ts` con `--maxWorkers 8`, eso dobla la carga. Ninguna regla dice qué hacer cuando el rojo es un timeout y hay otras sesiones lanzando suites. La regla del tope de `tech-stack.md` («repite sola la tarea») cubre una pasada verde lenta, no una roja.
- **Coste**: ~25 min de reloj entre el contraste, el relanzamiento de `kit:test-headless` y el contraste muerto; respaldo: walkthrough de la 0313, §4.3.
- **Propuesta**: si todos los rojos de una pasada son timeouts, lanzar el contraste en serie (rama y luego base), no a la vez, y apuntar en la línea `Gate:` la carga observada (otros `moon.exe`).
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un gate rojo cuyos fallos son todos `Test timed out` WHEN el cierre contrasta THEN corre el fichero en la rama y después en la base, no a la vez, y la fila de deuda nombra las dos pasadas verdes.

### 2. Un arreglo de la pasada de fix cambió el contrato de una función compartida sin que nadie lo viera

- **Qué pasó**: para el Minor «sin git en el PATH, `git dijo:` sale vacío», el fixer cambió `git()` de `cli/src/git/git.ts` a `stderr: stderr || (error?.message ?? '')`. Con cualquier fallo de git sin stderr (`git diff --quiet` con diferencias, `git commit` sin nada que commitear), `stderr` pasaba a ser `Command failed: …`. `runGit` (`stderr || stdout`) perdía el stdout de git y `gitWithOutput` sumaba esa línea. El informe del fixer lo listó como concern («afecta a todo fallo con stderr vacío»), pero no revisó los llamadores. Lo cacé al leer el diff antes de la re-revisión. Lo arreglé con un test RED→GREEN («git() deja vacío el stderr de un git que falla sin escribir en él») y un commit propio, que la re-revisión cubrió.
- **Fuente**: el commit de la pasada de fix y el arreglo, juntados en el cierre de la 0313 (walkthrough §3); `git grep -n stderr -- cli/src` con siete llamadores.
- **Dónde en el kit**: `skills/sdd-verify/references/closing-the-review.md`, «SDD» (el despacho del fixer único), y `skills/sdd-implement-subagent/references/fix-loop.md`, «Reproduce before fixing».
- **Por qué el kit no lo evitó**: el encargo del fixer pide el test del hallazgo y la suite de lo tocado, no los llamadores de una función compartida que el arreglo cambia. La re-revisión lo habría visto (su plantilla nombra «a function or API contract» como riesgo legítimo), pero llega después del commit.
- **Coste**: ~10 min y un commit más en el rango de la re-revisión; respaldo: walkthrough de la 0313, §3.
- **Propuesta**: en el encargo del fixer único, una línea: «si un arreglo cambia una función que usan otros módulos, lista sus llamadores en el informe y di para cada uno si cambia lo que recibe».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un hallazgo cuyo arreglo natural toca una función compartida WHEN el fixer informa THEN el informe lista los llamadores con su efecto, y el hilo no necesita leer el diff para verlo.

### 3. La pasada de coherencia prueba el delta en una copia sin `sdd capability check`

- **Qué pasó**: el delta de la spec se probó dos veces en una copia con `sdd capability merge` (rc 0). En el cierre, `sdd capability check --path .docs/sdd --artifact <spec>` dio rc 0 con 5 avisos: «tiene N caracteres; el máximo aconsejado es 500: … si es nuevo, un comportamiento por requisito», para 5 de los 6 requisitos nuevos (647 a 1333 caracteres). Para entonces la spec estaba aprobada, y partirlos era cambiarla.
- **Fuente**: salida de `node dist/cli/bin/sdd.js capability check --path .docs/sdd --artifact .docs/sdd/specs/20261108-184209-feature-0313-tasks-superpowers-7/spec.md` en el cierre.
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md`, «the delta on a copy».
- **Por qué el kit no lo evitó**: la pasada pide fusionar en una copia, no validar el resultado.
- **Coste**: sin parada; 5 requisitos largos en la capacidad viva y una ruling. Respaldo: walkthrough de la 0313, §3.
- **Propuesta**: que la prueba en la copia corra también `sdd capability check --artifact` y lleve sus avisos al ✋ de la spec.
- **Verificada**: sí, contrastado: el aviso sale con la spec de la 0313 sobre la copia fusionada (el mismo comando del cierre).
- **Criterio de aceptación**: GIVEN un delta con un requisito nuevo de más de 500 caracteres WHEN se hace la pasada de coherencia THEN el aviso sale en la spec antes de la parada, no en el cierre.

### 4. La receta del paquete de la revisión final sigue sin `-C`

- **Qué pasó**: la 0313 trae `sdd workspace -C DIR`, el arreglo del menor de la 0300 (el workspace del plan quedaba en el worktree de revisión). La receta sigue con `WORKSPACE="$(sdd workspace "<plan>")"` dentro de `$REVIEW_DIR`. La decisión 3 de la spec la dejó fuera, aprobada por el dev-lead. En esta sesión, el paquete de la revisión final se hizo con `sdd workspace -C <worktree de la feature>`, y el worktree de revisión quedó sin `.temp`.
- **Fuente**: `skills/sdd-verify/references/encargo-revision.md:43`; ruling «Final: el paquete de la revisión final se hizo con -C» de `tasks.md` de la 0313.
- **Dónde en el kit**: `skills/sdd-verify/references/encargo-revision.md`, la receta del paquete.
- **Por qué el kit no lo evitó**: la CLI no tenía `-C` hasta esta rama.
- **Coste**: sin coste en esta sesión; en campo, el menor de la 0300 sigue en cada revisión final.
- **Propuesta**: sustituir en la receta `sdd workspace "<plan>"` por `sdd workspace -C "<worktree de la feature>" "<plan>"`, con la prueba de la skill (Art. I).
- **Verificada**: sí, la receta con `-C` usada en esta sesión: el paquete quedó en el workspace del plan y `review-0313-dc5edd43` sin `.temp`.
- **Criterio de aceptación**: GIVEN una revisión final con la receta WHEN se borra el worktree de revisión THEN el paquete sigue en el workspace del plan del worktree de la feature.

## Lo que hice por iniciativa propia

- Un smoke en un script `.mjs` del scratchpad que lanza el binario contra repos de prueba, una salida por THEN, y lo leí entero. Ninguna skill da la forma para una CLI. Funcionó: 23 filas de ejecución real en un solo comando.
- Los RED de la Task 2 los escribí en el scratchpad mientras el implementador de la Task 1 trabajaba, para no tumbar su pre-commit (`cli:test`) con tests en rojo en el árbol. Funcionó.

## Funcionó, no tocar

- El método SDD tras una compactación antes del plan: la regla de Native (más de una task tras compactar pasa a subagentes) se aplicó al elegir el método, sin pasar por Native.
- El paquete de la revisión final en un worktree aislado y el contraste en un worktree de la base.
- Los Minor que entran en la pasada de fix con `review.minors: fix`.

## Menores

- `npx vitest` desde `cli/` en Git Bash: `Cannot find module …\vitest\vitest.mjs` (segundo caso tras la 0297); corregido en `tech-stack.md` §Testing con `pnpm exec` para ese shell — no localizado en el kit (es del proyecto)
- `sdd watch subagent` dio «TERMINADO: … devolvió su resultado» cuando el implementador y el fixer solo habían devuelto un resultado intermedio («sigo esperando a los tests en segundo plano»); el trabajo siguió unos minutos más — `cli/src/watch/` (`sdd watch subagent`)
- Junté el cierre dos veces: el contraste del rojo añadió una fila de deuda y una línea al walkthrough después del primer commit de cierre — `skills/sdd-archive/SKILL.md` paso 5 frente al paso 6
