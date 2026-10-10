---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261010-205531-patch-0167-superpowers-7-compat
task: 0167
mode:
date: 2026-10-10
---

# Ticket para el kit — patch 0167: el hotfix a `main` y su port a `develop` salieron del kit a mano, y los commits se hicieron sin hook

## Contexto

- Carril y modo: patch (petición cerrada del dev-lead), hotfix desde `main` con release 2.3.4, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch` (leídas con `Read` del working tree); la campaña con `tests/headless/run.sh` y `lib.sh`
- Proyecto: el propio kit (skills en Markdown, tests Pester; en `develop`, además, la CLI en Node)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: sujetos headless Sonnet (18), sin subagentes del hilo
- Coste en reloj: no medido con precisión; `patch.md` registra 0,3 h hasta el fix, y el cierre, el corte y el port a `develop` vinieron después
- Coste en tokens: sujetos 6,43 $ (RED 2,38, GREEN 2,23, GREEN sobre `develop` 1,83); hilo no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Ningún commit de la sesión pasó por el hook, y el agente escribió «pre-commit en verde»

- **Qué pasó**: en el clon, `git config --show-origin core.hooksPath` no devuelve nada, así que ni `.githooks/pre-commit` ni `pre-merge-commit` se ejecutaron en los commits `4da56991`, `0175fcb5`, `a868f941`, `b33b53e9`, `570afce3` (merge en `main`) y `302cc638` (merge en `develop`). El agente tomó «el commit se creó» por «el hook pasó». Escribió «pre-commit en verde» en la línea `Validación en campo` de `patch.md`, ya publicada en `main`, y «hook en verde» en sus mensajes al dev-lead. Así, el fix `4da56991` entró con `tests/WordBudget.Tests.ps1` en rojo: `SKILL.md` medía 8517 con un tope de 8430. Ese test no lleva etiqueta `Slow`, y el hook lo habría parado. Se vio después, en la suite completa del corte. Lo que sí se ejecutó a mano: Pester completo en `main` (1330/0/9) y en `develop` (1045/0/15), y `moon run cli:typecheck cli:test kit:roadmap` en `develop` tras el push (735/735).
- **Dónde en el kit**: `.githooks/pre-commit` («Activar una vez por clon: git config core.hooksPath .githooks»); `Start-KitSession.ps1` y el hook `SessionStart` `.claude/hooks/Test-KitSessionSource.ps1`, que comprueban de dónde salen las skills pero no si los hooks de git están activos; `skills/sdd-start-feature/SKILL.md` paso 6 («si `HEAD` sigue en la base de la task, el pre-commit lo rechazó»), que da por hecho que el hook corre.
- **Por qué el kit no lo evitó**: activar el hook es un paso manual por clon, y nada en el arranque ni en el cierre lo comprueba. El agente no lo comprobó antes de afirmarlo.
- **Coste**: un commit de arreglo (`a868f941`), una pregunta al dev-lead sobre los topes y una línea falsa publicada en `patch.md` de `main`.
- **Propuesta**: que el hook `SessionStart` del repo avise si `core.hooksPath` no apunta a `.githooks`. Y que el cierre no escriba «pre-commit» ni «hook» en la verificación sin haber leído antes `git config core.hooksPath`.
- **Verificada**: sí — `git config --show-origin core.hooksPath` vacío en PowerShell y en Git Bash en el worktree del patch; `cat <git-common-dir>/config | grep hooks` sin resultado.
- **Criterio de aceptación**: GIVEN un clon sin `core.hooksPath`, WHEN arranca una sesión con `Start-KitSession.ps1`, THEN el aviso de arranque dice que los hooks de git no están activos y da `git config core.hooksPath .githooks`.

### 2. La receta del merge no cubre el hotfix a `main` ni su vuelta a `develop`

- **Qué pasó**: el dev-lead pidió «merge a main con push y después main a develop, como el patch 0155». `Invoke-SddMerge.ps1` solo fusiona en `merge.into` de `sdd-kit.json` (`develop`): `Resolve-MergePolicy` no admite otro destino. El merge en `main` se hizo a mano en un worktree temporal (`git worktree add merge-0167 main`, `git merge --no-ff`, `git push origin main`), y también el tag `v2.3.4` y su push, copiando la forma de `v2.3.3`. La vuelta a `develop` se hizo con otro worktree y una rama temporal, un `git merge --no-commit main`, los conflictos resueltos, un `git merge --ff-only` en el checkout principal y `git push origin develop`. Ninguna de las dos pasó por el cerrojo del repo.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 6; `skills/sdd-end-feature/references/merge-recipe.md`; `skills/sdd-templates/scripts/Invoke-SddMerge.ps1` (`Resolve-MergePolicy`); en `develop`, `sdd merge`.
- **Por qué el kit no lo evitó**: el carril patch dice que puede salir como `hotfix/*`, pero la receta solo conoce `merge.into`. El cierre manda «nunca `git merge`, `git pull`, `git push` a mano», y en un hotfix no hay otra forma.
- **Coste**: dos merges y un tag a mano, sin cerrojo (commits `570afce3` y `302cc638`); tiempo sin respaldo.
- **Propuesta**: un `-Into <rama>` en el script (`--into` en `sdd merge`) que solo se acepte con una orden del dev-lead registrada en `patch.md`. Y en la receta, una sección «Hotfix desde la rama estable»: merge en la estable, tag, y vuelta de la estable a la integración con el mismo script.
- **Verificada**: sí — contrastado con `Invoke-SddMerge.ps1:57-67` (lee `merge.into` y no tiene parámetro de destino).
- **Criterio de aceptación**: GIVEN `merge.into: develop` y una rama de patch sacada de `main`, WHEN el cierre ejecuta `Invoke-SddMerge.ps1 -Into main -Push`, THEN fusiona con `--no-ff` en `main` bajo el cerrojo y publica solo `main`.

### 3. Un hotfix desde `main` no mira si `develop` divergió en lo que va a tocar

- **Qué pasó**: el patch se diseñó, se midió y se cerró sobre la forma de `main`. Al fusionar `main` en `develop` salieron conflictos en 11 ficheros, 6 de ellos skills o tests. En `develop`, el paso de la spec había pasado a `sdd-propose`, en inglés, y `sdd-roadmap` ya preguntaba con `sdd-grilling`. Hubo que parar a preguntar al dev-lead, portar el cambio a otra skill y lanzar un segundo GREEN.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` pasos 1 y 4 (no hablan de la rama estable ni de la vuelta a la integración); `skills/sdd-end-patch/SKILL.md` paso 6.
- **Por qué el kit no lo evitó**: el carril patch da por hecho que la rama sale de la integración. Con un hotfix, la divergencia aparece en el último paso, cuando el presupuesto y el alcance ya están cerrados.
- **Coste**: un GREEN más (1,83 $), una parada con el dev-lead y el port en un merge (`302cc638`).
- **Propuesta**: en un patch que sale de la rama estable, el paso 1 ejecuta `git diff --name-only <estable> <integración> -- <ficheros que va a tocar>`. Si coinciden, `patch.md` declara el port y su coste antes del fix, y la pregunta al dev-lead se hace al arrancar.
- **Verificada**: sí — `git merge --no-commit --no-ff 0175fcb5` sobre `origin/develop` en un worktree de prueba dio los conflictos.
- **Criterio de aceptación**: GIVEN un patch desde `main` que toca `skills/sdd-start-feature/SKILL.md`, cambiado en `develop` desde el merge-base, WHEN arranca `sdd-start-patch`, THEN `patch.md` lleva una línea de port con los ficheros que divergen, antes del commit del fix.

### 4. El corte de la 2.3.4 se hizo copiando un commit, sin `sdd-end-release`

- **Qué pasó**: el corte (bump, changelog sellado, release notes, migración, marcadores de `.docs/workflow/`, estimation-log) se hizo calcando el commit `c71d0470` de la 2.3.3. No se invocó `sdd-end-release`, ni se miró si cubre un hotfix.
- **Dónde en el kit**: `skills/sdd-end-release/SKILL.md`; `skills/sdd-end-patch/SKILL.md`, que no dice qué hacer cuando el patch es el contenido de un hotfix con versión.
- **Por qué el kit no lo evitó**: ningún paso del cierre de patch enlaza con el corte de la release. El agente no buscó la skill.
- **Coste**: sin respaldo. El corte pasó la suite completa (1330/0/9), pero sin la verificación que `sdd-end-release` pudiera añadir.
- **Propuesta**: en `sdd-end-patch`, una línea: «si el dev-lead pide publicar el patch como versión, el corte es `sdd-end-release`».
- **Verificada**: sin verificar (no se leyó `sdd-end-release` entero).
- **Criterio de aceptación**: GIVEN un patch cerrado con la orden «publícalo como hotfix X.Y.Z», WHEN termina `sdd-end-patch`, THEN el agente invoca `sdd-end-release` para el corte en vez de rehacerlo a mano.

## Lo que hice por iniciativa propia

- Antes de decidir dónde iba la regla, conté en los extractos de los sujetos quién había leído `overrides-superpowers.md` (`grep -c overrides-superpowers *.tools.txt`: 0 de 6). Con eso la frase fue al paso 4, y el GREEN pasó de 5/5 a 0/5. Funcionó. Candidato a regla: antes de reforzar algo en una referencia, medir si los sujetos la abren.
- Hice un merge de prueba de `main` en `develop`, en un worktree desanclado, antes de fusionar de verdad. Así salieron los conflictos con tiempo de preguntar. Funcionó.

## Funcionó, no tocar

- `tests/headless/lib.sh` con `SUPERPOWERS_DIR`: medir el kit contra una versión concreta de superpowers desde la caché, sin la configuración del dev-lead, costó un `export`.
- Los techos `SUBJECT_CAP` y `COST_CAP` de `run.sh`, que cuentan todas las fases de la carpeta.
- `Merge-CapabilityDelta.ps1` y `Test-Capabilities.ps1` con un `ADDED` de patch; `Test-Roadmap.ps1` y `sdd roadmap check` tras los merges.
- `validation.mode: field`: el cierre no paró a pedir una validación que no se puede dar.

## Menores

- Los costes de las tablas de la campaña salieron sumando cada `RESULTADO`. Con `--resume`, el último ya es acumulado (lo dice `run.sh`), y hubo que corregir las tablas. — `tests/headless/run.sh`, comentario de `subject_resume` en `lib.sh`
- Un worktree de prueba en el scratchpad falló con `Filename too long` por las rutas de los moldes; junto a los demás worktrees, sí funcionó. — `merge-recipe.md` ya dice «junto a los demás»; no aplicado
- En el GREEN de `develop` hubo que copiar `red/subject.sh` cambiando la skill de entrada (`sdd-start-feature` por `sdd-propose`). Una variable para la skill medida lo evitaría. — `tests/headless/lib.sh` (`subject_init`)
- Una frase del paso 6 de `sdd-start-feature` ha quedado vieja con la 7.0.0: «con la salida vacía, `task-done` sale con 1». `executing-plans` 7.0.0 ya registra `→ (no output)`. Hoy no hace daño. — `skills/sdd-start-feature/SKILL.md` paso 6
