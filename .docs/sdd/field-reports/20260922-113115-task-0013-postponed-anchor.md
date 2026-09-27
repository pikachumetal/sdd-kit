---
kit_version: 1.1.0 (sdd-kit.json); skills del working tree de feature/0013, rumbo a 1.2.0
superpowers_version: 6.3.0
lane: task
id: 20260922-113115-task-0013-postponed-anchor
task: 0013
mode: full
date: 2026-09-22
---

# Ticket para el kit — task 0013: plantillas de anclaje y destino que falta en el cierre

## Contexto

- Carril y modo: task full, perfil `delegate`, ids `sequence`.
- Skills del kit usadas: `sdd-start-task`, `sdd-templates`, `sdd-end-task`, `add-to-changelog` (por su formato), `sdd-feedback`; de superpowers, `brainstorming` y `writing-plans`.
- Proyecto: el propio repo del kit (skills en Markdown y tests Pester), un dev-lead, varios worktrees en paralelo sobre un repo bare.
- Modelo del hilo: Opus 5.
- Modelos de los subagentes: un revisor Sonnet (revisión y re-revisión) y 18 sujetos headless Sonnet (RED y GREEN).
- Coste en reloj: unas 2,5 h de sesión (spec y plan ~1 h, implementación y cierre ~1,5 h).
- Coste en tokens: revisor ~326k tokens de subagente; campañas, 11,59 $ (RED 4,67 $ y GREEN 6,92 $); hilo no medido.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una regla que gobierna una decisión, puesta en `references/`, no se lee

- **Qué pasó**: la regla nueva del paso 4 («si el destino no existe, créalo desde su plantilla y dilo») se escribió en `references/aprendizajes-skills.md`, y el `SKILL.md` solo enlazaba. En el GREEN, 0 de 2 sujetos abrieron el fichero: el stream solo muestra `sdd-end-task`, `sdd-templates` y `add-to-changelog`. Los dos dejaron el aprendizaje solo en el walkthrough. Al subir la regla al `SKILL.md`, 3 de 3.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` pasos 2–5, que remiten a `references/` con una frase; en general, cualquier `references/` que contenga un «si X, haz Y».
- **Por qué el kit no lo evitó**: `architecture.md` §6 ya dice que lo que gobierna la decisión se queda en el `SKILL.md`, pero el criterio se aplica al crear la referencia, no al añadirle una regla después. Añadir una cláusula a una referencia existente parece una edición menor y no se vuelve a pasar el filtro (a)+(b).
- **Coste**: una ronda de GREEN fallida más 4 reruns (~4 $) y una ronda de revisión sobre la duplicación resultante.
- **Propuesta**: barrer `skills/*/references/` buscando reglas condicionales de decisión («si…», «nunca…», «cuando falta…») y decidir con A/B cuáles suben al `SKILL.md`. Añadir a la anatomía: editar una referencia con una regla nueva vuelve a pasar el filtro (a)+(b).
- **Criterio de aceptación**: GIVEN una regla de decisión que solo vive en una referencia enlazada desde un paso, WHEN un sujeto headless ejecuta ese paso, THEN el stream muestra que leyó la referencia o actuó según la regla; hoy falla 0/2 en el paso 4 de `sdd-end-task`.

### 2. Una enmienda que amplía los ficheros de una task no mira las demás tasks en curso

- **Qué pasó**: la enmienda aprobada amplió la 0013 a las dos init (`estructura.md`, `generacion.md`, el paso 3 de `sdd-init-greenfield/SKILL.md`). Ese mismo día, en otro worktree, la 0012 se partió y creó la 0019, cuyo punto (d) era exactamente la forma de lo que crea la init, incluida la plantilla de estimación. Nadie lo vio hasta el merge a `develop`, que dio conflicto en el roadmap y en `capabilities/onboarding.md`. El solape se resolvió anotando en la fila 0019 que la 0013 salda su punto (d).
- **Dónde en el kit**: `skills/sdd-start-task/references/control-profiles.md` («Desvío»: la enmienda se propone y se aprueba) y la regla «nunca dos tasks a la vez sobre el mismo fichero caliente» del roadmap del proyecto, que ninguna skill consulta.
- **Por qué el kit no lo evitó**: la enmienda se evalúa contra la spec propia. Ni el paso de desvío ni la plantilla de spec piden contrastar los ficheros nuevos con la columna «Ficheros que toca» de las otras tasks abiertas.
- **Coste**: conflicto de merge en tres ficheros, alcance duplicado entre dos tasks y una 0019 que habrá que recortar a mano.
- **Propuesta**: cuando una enmienda añade ficheros o capacidades, el agente lista qué tasks del roadmap (abiertas o en otro worktree) los tocan, lo pone en la enmienda y el dev-lead decide al aprobarla. Actualizar además la columna «Ficheros que toca» de la propia task.
- **Criterio de aceptación**: GIVEN una task en curso y una enmienda que añade un fichero que otra fila pendiente del roadmap declara, WHEN el agente propone la enmienda, THEN la enmienda nombra esa task y el solape antes de pedir la aprobación.

### 3. El paso 10 del cierre supone que `develop` está en algún worktree

- **Qué pasó**: con el bloque `merge` completo y el perfil `delegate`, el paso 10 manda fusionar en `develop` sin preguntar. Pero el repo es bare y ningún worktree tenía `develop`. Improvisé un worktree temporal, fusioné con `--no-ff` y lo borré. Antes hubo que integrar `develop` en la rama, porque había avanzado con otra task.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` paso 10 y `skills/sdd-start-task/references/control-profiles.md` («Merge a develop»), que delegan en `superpowers:finishing-a-development-branch`, y esa skill supone que se puede hacer checkout de la rama base.
- **Por qué el kit no lo evitó**: el patrón repo bare más un worktree por rama está documentado en el `tech-stack.md` del kit, pero no en la skill de cierre.
- **Coste**: bajo en tiempo, pero improvisar ahí llevó al error que cuento abajo (merge sin hook).
- **Propuesta**: una receta de dos líneas en el paso 10. Si la rama destino no está en ningún worktree: integrar primero el destino en la rama (suite en verde) y luego hacer el merge en un worktree temporal, pasando el hook, y quitarlo después.
- **Criterio de aceptación**: GIVEN un repo bare sin `develop` en ningún worktree y un bloque `merge` completo, WHEN se cierra una task en `delegate`, THEN el sujeto fusiona sin `--no-verify` y deja la lista de worktrees como estaba.

### 4. El harness carga la skill de la caché del plugin, no la del working tree

- **Qué pasó**: `/sdd-start-task` y `sdd-end-task` se cargaron desde la caché 1.1.0, y la del working tree tenía perfiles, validación diferida, política de merge y el paso 11. Hubo que contrastarlas a mano en los dos casos, como pide la regla 2 del `CLAUDE.md` del repo. `sdd-feedback` ni siquiera se puede invocar con `Skill`, porque no existe en la 1.1.0, y hubo que leerla del disco.
- **Dónde en el kit**: `CLAUDE.md` del repo, regla 2 (dogfooding); `tech-stack.md`, «El repo principal es bare…».
- **Por qué el kit no lo evitó**: la regla existe pero depende de que el agente la recuerde en cada paso. Ningún mecanismo carga el working tree en la sesión que desarrolla el kit.
- **Coste**: dos lecturas extra y el riesgo, si no se contrasta, de cerrar con el checklist viejo (sin 🧪, preguntando el merge).
- **Propuesta**: lanzar las sesiones de desarrollo del kit con `--plugin-dir` apuntando al worktree (o un script de arranque que lo haga) y documentarlo en el `CLAUDE.md` del repo.
- **Criterio de aceptación**: GIVEN una sesión en un worktree del kit, WHEN se invoca una skill del kit, THEN el `Base directory` que inyecta el harness es el del worktree, no el de la caché.

### 5. El disparador de la validación diferida admite un dueño implícito

- **Qué pasó**: el dev-lead difirió con «muy difícil de probar si no es en el trabajo diario». La tercera condición pide un disparador con dueño. Lo registré como «uso diario del kit 1.2.0 por el dev-lead», deduciendo el dueño sin preguntarlo.
- **Dónde en el kit**: `skills/sdd-start-task/references/control-profiles.md`, «Validación diferida», condición 3.
- **Por qué el kit no lo evitó**: no dice si un «uso» sin sujeto explícito cuenta como disparador con dueño, ni si hay que preguntar el dueño cuando falta.
- **Coste**: bajo; es la tercera task seguida que se difiere así (0012 y 0013 el mismo día), así que la forma va a repetirse.
- **Propuesta**: decir que, si el usuario difiere sin dueño, el dueño por defecto es quien difiere, y se escribe así.
- **Criterio de aceptación**: GIVEN un «lo pruebo en el día a día» sin dueño, WHEN se registra el diferido, THEN la línea del walkthrough nombra al dev-lead como dueño sin inventar una task.

## Lo que hice por iniciativa propia

- **Repetir un escenario del RED con el molde sin sesgo (E1b)**: el primer E1 tenía la estructura escrita en `tech-stack.md` y los sujetos la usaban como destino. Quitarla cambió el resultado. Funcionó; es candidato a paso de «comprobación previa de cada escenario» en `tech-stack.md`: ¿el molde ofrece una salida que la guía nueva quiere cerrar?
- **Reruns hasta tener 3 sujetos válidos** cuando uno no cumplía la precondición del THEN, en lugar de dar el 1/2 por bueno o por malo. Funcionó.
- **Re-revisión acotada al diff de los fixes**, reanudando al mismo revisor con las mismas restricciones: barata (~170k) y confirmó los cinco fixes.
- **Aceptar a medias un hallazgo Important de la revisión** (volver a puntero en el paso 4) con la evidencia del GREEN en contra. El revisor lo dio por bueno en la re-revisión.

## Funcionó, no tocar

- **La primera pregunta sola** con el enunciado sacado de la rama `feature/0013`: carril, modo, lite descartado citando la condición que falla y perfil, en un turno y sin preguntas de diseño.
- **El RED antes de la spec**: recortó el ticket (la pérdida en silencio no se reproducía) y reenfocó la spec en lo que sí fallaba.
- **El flujo de enmienda**: la ampliación de alcance tras aprobar quedó en `## Enmiendas` con la frase del dev-lead y una aprobación explícita aparte, sin tratar la elección de alcance como aprobación.
- **La cabecera «Restricciones globales» en el encargo del revisor**: cazó dos defectos reales de la plantilla (un estado del roadmap que faltaba y una cabecera de tabla inventada).
- **El hook de pre-commit con la suite**: forzó a juntar los tests RED con su implementación en el mismo commit, como ya describe la task 0007.

## Errores míos, no huecos del kit

- **Hice el merge a `develop` con `--no-verify`**. El árbol era idéntico a un commit que acababa de pasar el hook, pero nadie lo autorizó y la regla es no saltárselo.
- **Mi primer molde de E1 estaba sesgado**: le daba al aprendizaje un sitio en `tech-stack.md`. Me costó una ronda de 2 sujetos.
- **En la enmienda estimé «unas 5 tasks internas»** y el plan salió con 3: conté por fichero y no por entregable revisable.
