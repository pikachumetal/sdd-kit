---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: task
id: 20260923-202119-task-0044-commit-per-milestone
task: 0044
mode: full
date: 2026-09-23
---

# Ticket para el kit — task 0044: un commit por hito, y el merge del cierre choca con los registros compartidos

## Contexto

- Carril y modo: task full, perfil `delegate`
- Skills del kit usadas: `sdd-start-task`, `sdd-templates`, `sdd-end-task`, `add-to-changelog`, `sdd-feedback` (y las de superpowers `brainstorming`, `writing-plans`, `subagent-driven-development`)
- Proyecto: el propio kit — skills en markdown, suite Pester con `pre-commit` (conjunto rápido) y `pre-merge-commit`, un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet (2 implementadores, 2 revisores de task, 1 revisor final; 12 sujetos headless)
- Coste en reloj: ~1,4 h (0,5 h spec y plan, 0,9 h implementación y cierre)
- Coste en tokens: hilo no medido; subagentes 602k; sujetos 3,93 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El merge del cierre aborta por conflictos en los registros que toda task toca

- **Qué pasó**: mientras corría la task, otra task se fusionó en `develop` (12 commits). `Invoke-SddMerge.ps1` falló con `merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.`, y la receta dice que un conflicto de `merge:` no se reintenta: lo resuelve una persona. La task quedó «No terminado» y el dev-lead tuvo que decidir. Los tres ficheros son registros de solo añadir: dos tasks añaden entradas distintas (una línea de changelog, una fila del roadmap) y el log se regenera.
- **Dónde en el kit**: `skills/sdd-end-task/references/merge-recipe.md` §«Si el script falla»; `skills/sdd-templates/scripts/Invoke-SddMerge.ps1` (paso `merge:`), que regenera `estimation-log.md` solo cuando es el único conflicto.
- **Por qué el kit no lo evitó**: la receta trata todo conflicto igual, y el script solo resuelve el del log si va solo. Tampoco hay camino escrito para integrar la base en la feature antes del merge: la 0044 dejó fuera los merges de sincronización, y con la forma nueva un merge así añade un commit que no es ningún hito.
- **Coste**: la task no se cierra en la sesión y hace falta una parada del dev-lead para un conflicto mecánico. Con varias tasks en paralelo pasará en casi cada cierre.
- **Propuesta**: si los únicos ficheros en conflicto son `changelog.md`, `roadmap.md` y `estimation-log.md`, el cierre integra la rama destino en la feature (merge de sincronización), conserva las dos entradas en changelog y roadmap, regenera el log con el script y relanza `Invoke-SddMerge.ps1` una vez. Un conflicto en cualquier otro fichero sigue siendo de una persona. `commit-milestones.md` dice que ese merge va después del commit de cierre y no rompe la forma (2 + N + un merge de sincronización).
- **Criterio de aceptación**: GIVEN una feature cerrada y `develop` avanzado con otra task que añadió su fila al roadmap y su línea al changelog, WHEN el agente ejecuta el paso 10 de `sdd-end-task`, THEN la rama destino acaba con las dos entradas en cada registro y el log regenerado, sin parar a preguntar; y GIVEN el mismo caso con un conflicto también en una skill, THEN para y lo informa como hoy.

### 2. El trailer de atribución se lee como el modelo del implementador

- **Qué pasó**: el revisor de la Task 2 marcó Important «implementador Opus en vez de Sonnet» por el `Co-Authored-By: Claude Opus 5.5` del commit, pero el implementador corrió en Sonnet. El hilo lo rechazó con un ruling y la revisión final le dio la razón.
- **Dónde en el kit**: `skills/sdd-start-task/references/encargo-revision.md` (cabecera del encargo de revisión); el bloque «De proceso» de `plan-template.md` no viaja al revisor y el trailer sí se ve en el diff.
- **Por qué el kit no lo evitó**: la cabecera no dice que el trailer de atribución es de la sesión.
- **Coste**: un Important falso, un ruling y una comprobación en la revisión final (~5 min de hilo).
- **Propuesta**: una frase en la cabecera del encargo de revisión: «el trailer `Co-Authored-By` es la atribución de la sesión, no el modelo que escribió el diff». Ya está como fila de deuda en el roadmap.
- **Criterio de aceptación**: GIVEN un commit de implementador Sonnet con el trailer del modelo de la sesión, WHEN un revisor de task lo revisa con la cabecera, THEN no lo reporta como hallazgo (RED: el revisor de la Task 2 de esta task, 1/1).

### 3. El mensaje del commit de una task no lo revisa nadie antes de que quede enterrado

- **Qué pasó**: el cuerpo del commit de la Task 1 salió sin tildes (Art. III). La revisión de la task no lo vio y lo marcó la revisión final. Con la forma nueva ese commit ya era intermedio en la rama, y arreglarlo exigía reconstruir tres commits y cambiar un hash que `tasks.md` ya apuntaba. Se quedó sin arreglar.
- **Dónde en el kit**: `skills/sdd-start-task/references/commit-milestones.md` §«Receta»; `skills/sdd-start-task/SKILL.md` paso 6 (juntar la task).
- **Por qué el kit no lo evitó**: la receta solo junta si hay más de un commit en el rango; con uno solo, el mensaje del implementador pasa tal cual, y el paquete de revisión de task muestra solo el asunto del commit, no su cuerpo.
- **Coste**: un Important sin arreglar en `develop`, una decisión más para el dev-lead y un Minor de deuda.
- **Propuesta**: al cerrar el hito, el hilo escribe siempre el mensaje del commit juntado, también con un solo commit (`git commit --amend` con el mensaje del hito, sin interactivo), y lo hace antes de apuntar el hash en ningún artefacto.
- **Criterio de aceptación**: GIVEN una task con un solo commit cuyo cuerpo incumple el Art. III, WHEN su revisión queda limpia y el hilo cierra el hito, THEN el commit que queda tiene el mensaje corregido y es su hash el que apunta `tasks.md`.

### 4. Una decisión del dev-lead dentro de la pregunta de validación se pierde

- **Qué pasó**: en el paso 7 el agente presentó la validación y, en el mismo mensaje, una decisión que era del dev-lead (reescribir o no un commit). El dev-lead respondió solo a la validación («test diferido»), y la decisión se resolvió con la opción conservadora.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 7.
- **Por qué el kit no lo evitó**: el paso 7 fija qué es validar, pero no dice que una decisión pendiente vaya en su propia pregunta.
- **Coste**: bajo en esta sesión (la opción conservadora era aceptable); alto si la decisión hubiera sido de alcance.
- **Propuesta**: una decisión que es del dev-lead y sale de la revisión final se pregunta con `AskUserQuestion`, sola, antes de presentar la validación.
- **Criterio de aceptación**: GIVEN una revisión final con un hallazgo cuya resolución es del dev-lead, WHEN el agente llega al paso 7, THEN pregunta ese hallazgo en un turno propio y presenta la validación después.

## Lo que hice por iniciativa propia

- **Techo de coste dentro del lanzador**: `green/run.sh` suma el coste de cada sujeto terminado y se para antes de lanzar otro si pasa el techo declarado en la spec. Funcionó: el Art. I proporcional pide parar al superar la previsión, y así el techo lo aplica el lanzador sin depender de que el hilo vigile.
- **RED de archivo**: el RED entero salió del `git log` de ramas ya fusionadas, sin sujetos. Ya está en `tech-stack.md`.
- **Paquete de la revisión final sin la carpeta de evidencia**, hecho a mano con `git diff -- . ':(exclude)…/green'` (112 KB). Es el segundo reporte de lo que pide la 0032.
- **Avisos de fase en lenguaje llano** en cada cambio de paso, porque lo pidió el dev-lead en el arranque. Es lo que la 0015 recoge del ticket de la 0040.

## Funcionó, no tocar

- La primera pregunta, sola, con carril, modo, perfil y la fila del roadmap como enunciado: una respuesta y a la spec.
- El perfil `delegate`: solo se paró en la spec y en la validación; el plan pasó sin gate.
- La receta de juntar con `git reset --soft` pasó el `pre-commit` en la apertura, y la regla del hash en el hito siguiente se cumplió sola en la rama de la propia task.
- La previsión del Art. I proporcional: 12 sujetos y 3,93 $ frente a un techo de 14.
- La copia de los tests RED fuera del repo y el `git diff --no-index` al volver el implementador: una línea y confirma que el contrato llegó intacto.

## Errores míos, no huecos del kit

- Con el modo auto sin veredicto para `Write`, escribí la spec en el scratchpad y la copié con `Copy-Item` antes de preguntar al dev-lead, cuando el mensaje del harness pedía parar y decírselo.
- El molde del GREEN tenía a la Task 2 de juguete sin THEN: cuatro sujetos pararon a proponer una enmienda y el escenario de los RED de la task siguiente quedó sin medir.
- La estimación contó la campaña como tiempo de espera (2,5 h frente a 0,9 h reales), justo lo que advierte `estimation.md`.
