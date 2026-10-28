---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261028-132236-feature-0228-no-powershell
task: 0228
mode: full
date: 2026-10-28
---

# Ticket para el kit — feature 0228: sin PowerShell en el repo y un turno del cerrojo por gate

## Contexto

- Carril y modo: feature full, Native, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: sdd-propose, sdd-grilling, sdd-start-feature, sdd-worktrees, sdd-implement, sdd-tdd, sdd-verify, sdd-parallel-agents, sdd-archive, add-to-changelog, sdd-feedback
- Proyecto: el repo del kit (plugin de Claude Code con CLI en TypeScript), una persona, varias ramas abiertas a la vez
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec, re-revisión), Sonnet 5.5 (eje Código)
- Coste en reloj: 4,07 h frente a 4 h estimadas; la implementación, 1,40 h; el cierre, ~2,7 h
- Coste en tokens: 84.725.498 del hilo y 4.987.718 de subagentes; 29,43 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El cierre esperó a `kit:test-headless` colgado durante horas sin mirar los procesos

- **Qué pasó**: el gate de cierre y sus contrastes corrieron en segundo plano y el hilo esperó la notificación. `kit:test-headless` se colgó tres veces: ~100 min en la rama (cortado al cerrarse la sesión), 22 min en `develop` y 28 min con `--maxWorkers 4`. Los `bash` de `battery.sh`, `run.sh` y `subject.sh` estaban bloqueados y sin hijos. El hilo solo lo vio cuando el dev-lead preguntó «estas mucho tiempo esperando no?». No se lanzó `sdd watch command`; y aunque se hubiera lanzado, moon escribe `▮▮▮▮ kit:test-headless (running for 1500s)` cada 30 s, así que el fichero de salida nunca se queda en silencio.
- **Fuente**: logs del scratchpad (`contrast-branch.log`: última línea `kit:test-headless (running for 5970s)`; `headless-w4-1.log`: `running for 1680s`); `Get-CimInstance Win32_Process` → `battery.sh` 65240, `run.sh` 70944 y `subject.sh` 76348 sin hijos y con 0,2 s de CPU desde las 14:05; walkthrough de la 0228 §2 y §4.1.
- **Dónde en el kit**: `skills/sdd-start-feature/references/control-profiles.md`, «Vigía de silencio» (líneas 160-168: `sdd watch command --path <fichero>` al lanzar una verificación lenta); `skills/sdd-archive/SKILL.md` paso 6, que no lo nombra.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Además, el vigía mide silencio en el fichero, y el latido de moon lo llena aunque la tarea esté colgada.
- **Coste**: ~2,5 h de reloj del cierre (walkthrough de la 0228 §2, «Causa de la desviación»).
- **Propuesta**: (a) el paso 6 de `sdd-archive` manda lanzar `sdd watch command` con cada suite en segundo plano, como hace con los subagentes; (b) `sdd watch command` no cuenta como actividad las líneas que solo repiten un latido (`running for <n>s`) y avisa cuando solo hay latido durante `longCommandMinutes`.
- **Verificada**: sin verificar (la parte (b): el formato del latido, visto en `contrast-branch.log`).
- **Criterio de aceptación**: GIVEN un fichero de salida que solo recibe `▮▮▮▮ <tarea> (running for <n>s)` durante `longCommandMinutes` WHEN corre `sdd watch command --path <fichero>` THEN termina con su aviso de silencio, no espera al final de la tarea.

### 2. El contraste de un rojo, envuelto en un `sdd lock run` que la base no admite anidado, se esperó a sí mismo

- **Qué pasó**: para el contraste en `develop` lancé `node cli/bin/sdd.js lock run -- moon run kit:test-headless --force`. El `kit:test-headless` de `develop` ya lleva su propio `sdd lock run`, y en `develop` no es reentrante (lo es desde esta feature): el de fuera tenía el cerrojo y el de dentro lo esperaba. Lo cortó el dev-lead: «llevas 20 min».
- **Fuente**: `moon.yml` de `develop` (`test-headless`: `args: [cli/bin/sdd.js, lock, run, --, pnpm, …]`); `contrast-develop.log`.
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md:17` («the same command, as is»).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: añadí un envoltorio que no era el comando del gate.
- **Coste**: ~20 min, y otra pasada para repetirlo.
- **Propuesta**: `merge-recipe.md` §«A red suite» dice expresamente que el contraste no añade envoltorios (`sdd lock run`, `timeout`) que el gate no lleva.
- **Verificada**: sí — contrastado con `skills/sdd-archive/references/merge-recipe.md:17`.
- **Criterio de aceptación**: GIVEN un gate rojo cuya tarea ya pide el cerrojo WHEN el agente contrasta sin la rama THEN el comando del contraste es el del gate, sin otro `sdd lock run` delante.

### 3. La verificación de una task en otra rama lanzó las baterías del lanzador fuera del cerrojo y cargó el gate de esta

- **Qué pasó**: mientras esta rama medía `kit:test-headless` con el cerrojo, otra rama verificaba su task con `vitest run test/kit`, que incluye `test/kit/headless/`. Sus `subject.sh` (uno con 11 min de CPU, colgado) corrían fuera de `sdd lock run`, y la carga es justo la que hace caer los forks de Git Bash. Esa sesión lo paró al avisarla.
- **Fuente**: `Get-CimInstance Win32_Process` → PID 82484, `bash.exe …\feature-0237-…\.temp\vitest-nj2ojN\accents-…\battery/subject.sh`, CPU 664 s; el mensaje de vuelta de esa sesión: «Era mi verificación de la Task 2 (vitest test/kit)».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, Native loop paso 4 («Verificación» de la task); en este repo, `tech-stack.md` §Testing (el cerrojo solo lo piden las tareas de moon).
- **Por qué el kit no lo evitó**: el cerrojo de suites lo piden las tareas de moon; un `vitest` lanzado a mano no pasa por él, y nada dice que la verificación de una task se ciña a los tests que toca.
- **Coste**: una medida de ~28 min hecha con la máquina cargada; sin respaldo de cuánto pesó.
- **Propuesta**: en este repo, `tech-stack.md` dice que la verificación de una task no corre `test/kit/headless` fuera de `moon run kit:test-headless`; o `cli/vitest.config.ts` excluye `**/kit/headless/**` cuando no viene de esa tarea.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una sesión que corre `vitest run test/kit` en su worktree WHEN otra tiene el cerrojo de suites THEN no arranca ningún `subject.sh` fuera del cerrojo.

### 4. `base: conflicto en .docs/sdd/tech-stack.md.` lo resolvió el agente, y la receta manda que lo haga una persona

- **Qué pasó**: `sdd merge --sync` paró con `base: conflicto en .docs/sdd/tech-stack.md.`. El conflicto era una frase de otra feature añadida a la misma línea que esta rama reescribía. Con el «cierra» del dev-lead, lo resolví yo: la línea de la rama más la frase de la base, el changelog con las dos entradas y el `estimation-log` regenerado; queda en el mensaje del merge (`7faa2ac4`).
- **Fuente**: salida de `node cli/bin/sdd.js merge --sync --project-root …` → `base: conflicto en .docs/sdd/tech-stack.md.`; `git log -1 7faa2ac4`.
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md:10` y `:46` («a person resolves»); `skills/sdd-archive/SKILL.md` paso 6.
- **Por qué el kit no lo evitó**: la regla existe y no la seguí al pie: la orden «cierra» no nombraba el conflicto. Es el segundo caso del menor (a) del ticket de la 0227 (una parada «Resuélvelo tú» por un conflicto de una línea).
- **Coste**: ~5 min; el riesgo, una resolución sin persona en un documento de anclaje.
- **Propuesta**: decidir la regla: o un conflicto solo de texto en `.docs/` que junta dos añadidos sin contradicción lo resuelve el agente y lo dice en el mensaje final, o la receta lo sigue parando y el agente no lo resuelve aunque haya un «cierra».
- **Verificada**: sí — contrastado con `skills/sdd-archive/references/merge-recipe.md:46`.
- **Criterio de aceptación**: GIVEN `base: conflicto en <doc>.md` con dos frases añadidas que no se contradicen WHEN el perfil es `delegate` THEN el agente hace lo que diga la regla elegida y lo nombra en el mensaje final.

## Lo que hice por iniciativa propia

- Reproduje el fallo de `kit:test-headless` fuera de los tests: 12 `bash` desde `spawn` de Node, cada uno con 5 trabajos en segundo plano haciendo `$(cd /usr && pwd)`; en 1 de 4 rondas, `pwd: write error: Bad file descriptor` y 5 de 12 colgados, y sin subshell nada y 8-10 veces más rápido. Sirvió para no reescribir los `$(pwd)` de `lib.sh`, que no lo arreglaban (58 `$(…)`), y apuntarlo a la feature que pasa el lanzador a Node.
- Probé `--maxWorkers 4` sin evidencia de que mis workers fueran la carga; no lo eran, se colgó igual y lo revertí. No funcionó.

## Funcionó, no tocar

- La cola del cerrojo en uso real: el gate del cierre escribió «Esperando el cerrojo de suites: vas 1.º en la cola; lo tiene (…\base-0231, PID 77584) desde 2026-10-28 14:14:53.» mientras otra rama contrastaba.
- El hook `SessionStart` avisó al reanudar la sesión con un lanzador que cogía el script del clon principal, y el texto de la skill se contrastó con el de la rama.
- La re-revisión única cerró limpia y no abrió otra.

## Menores

- Al coordinar con la sesión del lanzador externo, le dije que esperara al merge sin necesidad: el contrato ya estaba fijado y el cambio no dependía del merge; idas y vueltas entre sesiones — no localizado.
- Tras «haz lo que tengas que hacer» y «arréglalo», volví a preguntar al dev-lead dos veces (`delegate`) — `skills/sdd-start-feature/references/control-profiles.md`, perfil `delegate`.
- La sesión se reanudó con un lanzador que no conocía `start-kit-session.mjs` y las skills salieron del clon principal (segundo caso del menor (d) de la 0227) — `CLAUDE.md` regla 1.
