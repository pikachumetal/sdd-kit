---
kit_version: 2.3.3
superpowers_version: 6.4.2
lane: feature
id: 20261009-100956-feature-0146-propose-spec-and-plan
task: 0146
mode: full
date: 2026-10-09
---

# Ticket para el kit — feature 0146: spec y plan de propose, con siete reglas medidas por RED/GREEN

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native, `validation.mode: field`
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-grilling`, `sdd-rubber-duck`, `sdd-templates`, `add-to-changelog`, `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans`
- Proyecto: el repo del propio kit (skills en Markdown, CLI en Node, baterías de sujetos headless en Bash y Node, Pester); una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (revisor de dominio de la spec y revisor final), Sonnet 5.5 (revisor técnico); sujetos Sonnet 5.5, y Opus 5.5 en `g1`
- Coste en reloj: ~5,75 h de implementación frente a 7 h estimadas (más ~1,5 h de spec y plan)
- Coste en tokens: hilo 153,4 M; subagentes 5,2 M en 3 despachos; sesión 49,52 $; sujetos ~28 $ (techo aprobado 46 $)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un baseline limpio con n=2 sacó una regla que sí tenía fallo detrás

- **Qué pasó**: el RED de `l2` (la lista final de la explicación larga en el idioma del usuario) salió 2/2 limpio, la regla salió por el Art. I con una enmienda aprobada, y al repetir el mismo baseline con el mismo kit salió 0/2 («Dónde mirar» en respuestas en inglés). Hubo que pedir una segunda enmienda para recuperarla. Con `s2` pasó lo inverso en el GREEN: 2/2, 0/2 y 1/2 en tres rondas con textos casi iguales.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Fixtures y baselines» («Un baseline que no falla es evidencia válida de que la guidance sobra») y Art. I de la constitution.
- **Por qué el kit no lo evitó**: la regla del baseline limpio pide mirar de dónde sacó cada sujeto la conducta, no repetir la medida; con n=2, una conducta que depende del idioma o del tono sale limpia por azar.
- **Coste**: dos paradas de aprobación del dev-lead y ~1 $ de sujetos repetidos; respaldo: enmiendas del 2026-10-08 y del 2026-10-09 en `specs/20261008-193241-feature-0146-propose-spec-and-plan/spec.md`.
- **Propuesta**: antes de sacar una regla por un baseline limpio, repetirlo una vez (n=4 en total) cuando la conducta depende del idioma, del tono o de una elección de forma; ya apuntado en `tech-stack.md`, «Baterías por skill», como aprendizaje.
- **Verificada**: sí — `tests/sdd-start-feature-0146-red.md` (l2 2/2) y `noise-l2/out/` (l2 0/2) con el mismo kit.
- **Criterio de aceptación**: GIVEN un RED limpio 2/2 de una regla de idioma · WHEN el agente decide recortarla · THEN repite el baseline antes de proponer la enmienda.

### 2. Una regla que solo vive en una referencia no se aplica

- **Qué pasó**: la acción update se escribió en `control-profiles.md` y el paso 6 solo la nombraba («acción update de la fila "Desvío"»). En el GREEN de `u1`, 0 de 2 sujetos abrieron la referencia y ninguno la aplicó; funcionó al subir una frase al paso 6.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 y `references/control-profiles.md`; método en la constitution, Art. II.
- **Por qué el kit no lo evitó**: el kit no dice cuándo una regla puede vivir solo en una referencia; el patrón de «detalle en la referencia» se aplicó a una regla que se dispara en un paso concreto.
- **Coste**: una ronda de REFACTOR (~1 $) y ~20 min de recortes para caber en el tope; respaldo: `tests/sdd-start-feature-0146-green.md`, Task 5.
- **Propuesta**: en `sdd-agent-writing` (0151), la regla que se dispara en un paso lleva su frase operativa en ese paso; la referencia solo amplía.
- **Verificada**: sí — `green/out-u1-r0/` (0/2, sin lecturas de `control-profiles.md` en `tools.txt`) frente a `green/out/u1-*` (2/2).
- **Criterio de aceptación**: GIVEN una regla nueva solo en una referencia · WHEN un sujeto llega al paso que la dispara · THEN el RED de la batería muestra que no la abre; con la frase en el paso, el GREEN pasa.

### 3. El tope de 8.430 palabras de `sdd-start-feature/SKILL.md` obligó a recortar evidencia en cada task

- **Qué pasó**: cada regla nueva del paso 4, 6 y 7 superó el tope por entre 3 y 29 palabras; se resolvió con nueve rondas de recorte, quitando citas de evidencia de reglas vigentes y comprimiendo «Trabajo descubierto fuera de scope». El total de la skill subió a 20.600 con aprobación; el `SKILL.md`, no.
- **Dónde en el kit**: `tests/WordBudget.Tests.ps1` (`'sdd-start-feature' = @{ SkillMd = 8430; ... }`) y `skills/sdd-start-feature/SKILL.md`.
- **Por qué el kit no lo evitó**: el tope protege contra el crecimiento, pero la skill está en él y toda regla nueva obliga a recortar texto medido de otras; las citas de evidencia son lo más fácil de quitar y lo que más se pierde.
- **Coste**: ~30 min de rondas de recorte, sin respaldo de commit propio (repartido en los commits de las Tasks 2 a 6 y la pasada de fix).
- **Propuesta**: la 0160, que mueve el arranque a la skill de propose, mide de nuevo el tope; mientras tanto, la evidencia citada de una regla vive en la batería («Procedencia de las reglas») y la skill cita solo la ruta.
- **Verificada**: sí — `Invoke-Pester tests/WordBudget.Tests.ps1 -CI` en pwsh 7 falló con «mide 8459 y el tope es 8430» y similares en las Tasks 2, 3, 5 y 6.
- **Criterio de aceptación**: GIVEN una regla nueva de 30 palabras en el paso 6 · WHEN se añade · THEN cabe sin quitar citas de evidencia de otras reglas.

### 4. `sdd merge` sin argumentos fusiona en vez de enseñar su uso

- **Qué pasó**: para ver la ayuda ejecuté `node cli/bin/sdd.js merge` desde el worktree de la feature. Fusionó `feature/0146-entry-explore-propose` en `develop` (`da5a6dcd`) sin `--push`, en lugar de imprimir el uso. El resto de verbos rechaza `--help` con «opción desconocida».
- **Dónde en el kit**: `cli/src/` (el verbo `merge`) y `skills/sdd-end-feature/references/merge-recipe.md`.
- **Por qué el kit no lo evitó**: `--project-root` toma el directorio actual por defecto, y ningún verbo admite `--help`; la forma de descubrir el uso es ejecutar el verbo.
- **Coste**: un merge hecho antes de leer la receta; sin daño, porque la política lo autorizaba y el hook `pre-merge-commit` lo verificó; respaldo: `git log develop` (`da5a6dcd`) y el walkthrough de la feature.
- **Propuesta**: todos los verbos admiten `--help`; los que cambian el repo (`merge`, `roadmap publish`) exigen `--project-root` explícito.
- **Verificada**: sí — `node cli/bin/sdd.js merge` en Git Bash → «Fusionado feature/0146-entry-explore-propose en develop: da5a6dcd»; `node cli/bin/sdd.js id next --help` → «opción desconocida: «--help»».
- **Criterio de aceptación**: GIVEN `sdd merge` sin argumentos · WHEN se ejecuta · THEN imprime el uso y sale con código distinto de 0 sin fusionar; `sdd merge --help` imprime el uso.

### 5. `sdd task done` apuntó una task completa sobre un rango vacío

- **Qué pasó**: encadené en la misma orden el commit de la Task 5 y `sdd task done`. El pre-commit rechazó el commit (`FileOverlap.Tests.ps1`) y `sdd task done` escribió «Task 5: complete (commits 7f987c2..7f987c2…)»; retiré la línea a mano.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 («`sdd task done` va en su propia orden, después de comprobar que el commit existe») y el verbo `task done` de la CLI.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué; la CLI no la refuerza.
- **Coste**: ~5 min; respaldo: el ruling de la Task 5 en `tasks.md` de la feature.
- **Propuesta**: `sdd task done` rechaza registrar una task si `HEAD` sigue en su base, con el mensaje «sin commits en el rango: ¿falló el pre-commit?».
- **Verificada**: sí — observado en la sesión en Git Bash: el commit rechazado por el pre-commit, seguido en la misma orden de `node cli/bin/sdd.js task done <plan> 5 7f987c29 -- pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -CI"`, escribió la línea `complete`; no reproducido aparte.
- **Criterio de aceptación**: GIVEN `HEAD` igual a la base de la task · WHEN se ejecuta `sdd task done` · THEN no escribe la línea `complete` y sale con código distinto de 0.

## Lo que hice por iniciativa propia

- Ensayé cada escenario en seco (`DRY_RUN=1`) y comprobé el montaje con el `git log` de cada sujeto antes de la campaña: el ensayo no costó nada y detectó que las variantes de spec eran las esperadas.
- Repetí un baseline limpio sospechoso (`l2`) antes de dar la regla por sobrante del todo: destapó el hallazgo 1.
- Practiqué la forma nueva (🦆 y ✋) en las paradas de desvío de la propia feature antes de que la regla existiera; el dev-lead pidió explicación en prosa una vez («explícamelo mejor») y la segunda forma se entendió a la primera.
- Dejé la tabla de procedencia de cada regla en la batería, con su fallo de RED y su ronda de GREEN, para que la 0160 herede la batería sin releer la sesión.

## Funcionó, no tocar

- La primera pregunta con la partición propuesta: el dev-lead eligió partir en tres sin más preguntas.
- La review de spec con dos lentes: 20 hallazgos, 5 críticos reales (un MODIFIED no declarado, un literal que rompía un test Pester).
- El revisor final en un worktree desanclado mientras el hilo escribía los borradores de cierre; la suite completa corrió en paralelo.
- `sdd capability merge` y `check` sobre el delta, a la primera.

## Menores

- `AskUserQuestion` no existe en `claude -p`: un escenario que mide la pregunta del gate puntúa el intento o las opciones literales; anotado en `tech-stack.md` — `tests/headless/lib.sh`.
- Un `grep` con emoji en Git Bash no casó y dio un veredicto falso de `v1b`; se repuntuó con Python — no localizado en el kit (método de puntuación de las baterías).
- Tres scripts de edición con escapes en heredocs de Git Bash se rompieron (`\n`, regex), como ya avisa `tech-stack.md`; se resolvieron con ficheros escritos con la herramienta de edición — `.docs/sdd/tech-stack.md`, «Cómo se testean las skills».
- El plan nombró `npm test --prefix cli` como gate de cierre, y la CLI no tiene ese script (se prueba con `vitest`) — `skills/sdd-templates/templates/plan-template.md` §3, sin la fuente del comando.
- La sesión arrancó sin `Start-KitSession.ps1` y `sdd-grilling` no estaba en la caché; el hook lo avisó y la sesión se relanzó — `.claude/hooks/Test-KitSessionSource.ps1`.
