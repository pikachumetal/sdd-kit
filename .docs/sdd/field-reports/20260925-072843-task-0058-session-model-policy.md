---
kit_version: 1.1.0 (working tree de la 2.0.0 en curso)
superpowers_version: 6.4.1
lane: task
id: 20260925-072843-task-0058-session-model-policy
task: 0058
mode: full
date: 2026-09-25
---

# Ticket para el kit — task 0058: política de modelo y effort de la sesión en Native

## Contexto

- Carril y modo: task full, perfil `delegate`, spec aprobada por delegación en la primera pregunta.
- Skills del kit usadas: `sdd-start-task` (pasos 1 a 7), `sdd-end-task`, `add-to-changelog`, `sdd-feedback`. De superpowers: `brainstorming`, `writing-plans` y `executing-plans` (Native).
- Proyecto: el repo del kit (skills en Markdown, tests Pester, campañas de sujetos headless). Una persona.
- Modelo del hilo: Opus 5.5, effort no registrado.
- Modelos de los subagentes: revisor final `general-purpose` + `opus`, con el effort heredado de la sesión. Sujetos: 10 en Opus y 2 en Sonnet.
- Coste en reloj: ~1,8 h de hilo en total (0,5 h de spec y plan, 1,3 h de implementación), con una pausa del dev-lead en medio.
- Coste en tokens: 103k de subagentes. Hilo: no medido. Sujetos: 8,28 $.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El revisor final que se escribe en el plan no respeta el techo del Art. IV

- **Qué pasó**: en el paso 5, 1 de 2 sujetos del RED eligió el revisor final con la política de los subagentes y lo escribió en el plan como `sdd-kit:effort-low` + `sonnet` («diff de ~10 líneas, sin diseño que juzgar»). En el GREEN, un sujeto escribió `effort-medium` + `opus`. El techo (Opus con effort high) solo aparece en el paso 6 y en `encargo-revision.md`, y en el paso 5 no se lee ninguno de los dos.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`, campo `Modelo` y bloque «Decisiones que he tomado yo»; `skills/sdd-start-task/SKILL.md`, paso 5.
- **Por qué el kit no lo evitó**: el campo `Modelo` de la plantilla describe la política de los subagentes (gama media como suelo, el tier más barato para lo mecánico) y no nombra al revisor final. Quien escribe el plan aplica esa política también al revisor.
- **Coste**: un plan aprobado con un revisor final por debajo del techo. Si el paso 6 se lee al despachar, lo corrige; si no, la única revisión independiente de Native corre en un modelo barato.
- **Propuesta**: una frase en el campo `Modelo` o en «Decisiones»: «el revisor final de rama no sigue esta política: va con `sdd-kit:effort-high` + `opus` (Art. IV)».
- **Criterio de aceptación**: GIVEN una spec aprobada y el paso 5 en `delegate` con un plan Native de una sola task pequeña, WHEN el agente escribe el plan, THEN el revisor final aparece como `sdd-kit:effort-high` + `opus` o no aparece, en 2 de 2 sujetos (RED de la 0058: 1 de 2 con `effort-low` + `sonnet`).

### 2. Una sesión reanudada pierde los agentes y las skills del working tree

- **Qué pasó**: tras una pausa, la sesión se reanudó fuera de `Start-KitSession.ps1`. Los tipos `sdd-kit:effort-*` desaparecieron («no longer available»). `sdd-end-task` se cargó desde la caché 1.1.0, y `sdd-kit:sdd-feedback` dio `Unknown skill`. El hook avisó de lo primero. Lo segundo lo resolví leyendo las skills de la rama con `Read`, y el revisor final salió con el respaldo de la 0031.
- **Dónde en el kit**: `Start-KitSession.ps1` y el hook `SessionStart` (`.claude/hooks/Test-KitSessionSource.ps1`); regla 2 del `CLAUDE.md` del repo.
- **Por qué el kit no lo evitó**: el script cubre el arranque, no la reanudación. El aviso del hook dice qué contrastar, pero no qué hacer con una skill que no resuelve.
- **Coste**: un revisor final con un effort que nadie eligió y dos skills leídas a mano. Bajo en esta task; sin el aviso, habría sido una skill vieja ejecutada.
- **Propuesta**: que el aviso del hook diga también que una skill del kit que no resuelve se lee desde `skills/<nombre>/SKILL.md` de la rama, y que el script documente cómo reanudar (`--resume` o `--continue` con los mismos argumentos).
- **Criterio de aceptación**: GIVEN una sesión reanudada fuera del script, WHEN el agente va a invocar una skill del kit que no está en la caché, THEN la lee de la rama sin intentar antes el `Skill` que falla, en 2 de 2 sujetos.

### 3. El paquete de la revisión final incluye lo que entró por un merge de `develop`

- **Qué pasó**: la rama integró `develop` a mitad de la task por un freno de alcance. `review-package` con la base del arranque (`git merge-base` previo) generó 17 commits y 730 KB, casi todo de otra task. Construí a mano un paquete con la base del `merge-base` actual y sin los streams `out/`: 78 KB.
- **Dónde en el kit**: `skills/sdd-start-task/references/encargo-revision.md`, «Revisor final»; `overrides-superpowers.md`, fila de `executing-plans`.
- **Por qué el kit no lo evitó**: `executing-plans` dice `MERGE_BASE = git merge-base main HEAD` y el kit no lo adapta. Tras integrar la rama de integración, la base correcta es el `merge-base` con esa rama en ese momento, no el commit desde el que nació la rama.
- **Coste**: un revisor que lee 10 veces más diff del necesario, y el riesgo de que revise la otra task.
- **Propuesta**: una frase en «Revisor final»: «MERGE_BASE es `git merge-base HEAD <integración>` en el momento de la revisión, también si la rama integró la base a mitad».
- **Criterio de aceptación**: GIVEN una rama que integró `develop` tras su primera task, WHEN el hilo genera el paquete del revisor final, THEN el paquete contiene solo los commits de la task, en 2 de 2 sujetos.

## Lo que hice por iniciativa propia

- **Medí un hallazgo de la revisión final antes de arreglarlo.** El revisor vio una contradicción entre los pasos 4 y 5, que lo subí a Important. Antes de tocar la skill, lancé 2 sujetos (`d5`): 2 de 2 hacían lo correcto, así que no escribí la cláusula. Candidato a regla: un hallazgo de revisión que pide editar una skill lleva al menos un sujeto RED antes del fix, dentro del techo de la campaña. Funcionó, y costó 1,61 $.
- **Sujetos con el modelo del que depende la conducta.** Los sujetos de gate corrieron en Opus, porque en Sonnet no hay nada que recomendar sobre bajar de modelo. Por eso descarté como RED los 8 streams de la 0055, hechos en Sonnet. Queda en `tech-stack.md`.
- **Cerré el hueco «libres» del molde** con `free_in_base` de la 0057 en el sujeto que no lo medía. Queda en `tech-stack.md`.
- **Integré `develop` antes del cierre**, además del merge del freno, para fundir el delta sobre las capacidades que acababa de tocar la 0067.

## Funcionó, no tocar

- El freno de alcance por fichero cambiado en la base: saltó al abrir la Task 2, cuando la 0061 acababa de reescribir los mismos párrafos. La pregunta de una sola decisión se resolvió en un turno.
- La aprobación por delegación en la primera pregunta: una sola parada hasta el freno.
- El lanzador con `SUBJECT_CAP`, techo común y fichero `stop`: paró la campaña justo en el tope (12 de 12).
- La comparación del test RED con su copia (`git diff --no-index`) en Native.

## Errores míos, no huecos del kit

- El primer `task-done` de la Task 1 falló (con un `bash -c` y comillas anidadas), y no lo vi porque recorté su salida con `tail`. La línea `complete` se escribió tarde, con el rango mal.
- Previsión de coste inflada (~1,5 $ por sujeto Opus supuesto frente a 0,40–1,02 $ reales): la calculé sin medir un sujeto, aunque el plan decía medir el primero.
