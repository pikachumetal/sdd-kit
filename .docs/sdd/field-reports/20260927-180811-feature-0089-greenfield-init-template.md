---
kit_version: 1.1.0
superpowers_version: 6.4.2
lane: feature
id: 20260927-180811-feature-0089-greenfield-init-template
task: 0089
mode: full
date: 2026-09-27
---

# Ticket para el kit — feature 0089: entrevista de greenfield sobre un proyecto instanciado desde un template

## Contexto

- Carril y modo: feature full, perfil `delegate`, spec aprobada por delegación en la primera pregunta
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans` y `executing-plans` (Native)
- Proyecto: el propio kit (skills en Markdown, tests Pester), con un segundo repo de templates de aplicación como molde de la campaña
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisor final `sdd-kit:effort-high` + opus; sujetos headless Sonnet
- Coste en reloj: ~0,65 h de implementación y ~0,6 h de spec, plan y RED previo
- Coste en tokens: hilo 21.733.183, subagentes 1.884.475; sesión 9,58 $ y sujetos 9,79 $ (6)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El self-review del plan no cruza cada cláusula de un THEN con lo que la campaña puede observar

- **Qué pasó**: el THEN decía «el agente ha preguntado qué queda fuera de alcance… y las secciones llevan la respuesta o «pendiente»». La Task 2 (GREEN) medía solo lo escrito en `mission.md`, y el molde daba todas las respuestas de golpe, así que «ha preguntado» no se podía observar. El self-review del plan marcó el requisito como cubierto («→ Task 1 y Task 2 ✓»). Lo encontró el revisor final como Important: la pregunta 4 la hizo 1 de 2 sujetos y la 5 ninguno. Costó una enmienda y una parada del dev-lead.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`, §4 «Self-review (cobertura spec → tasks)», y el paso 5 de `skills/sdd-start-feature/SKILL.md` («comprueba que cada escenario de la spec tiene su task»).
- **Por qué el kit no lo evitó**: la comprobación es por requisito o escenario, no por cláusula. Un THEN con dos cláusulas (una conducta y un resultado) queda cubierto si alguna task toca cualquiera de las dos.
- **Coste**: un Important en la revisión final, una pasada de fix y una parada en `delegate` para enmendar la spec.
- **Propuesta**: en el self-review, cada cláusula de un THEN (cada «y», cada AND) se asigna a una task que la observa. Si la task es una campaña, la cláusula se asigna a una fila de medición que el molde y la petición permiten observar; si ninguna puede, se dice en el plan antes de ejecutar.
- **Criterio de aceptación**: GIVEN una spec con el THEN «el agente pregunta X y el documento lleva Y», y un plan cuyo GREEN usa una petición que ya trae las respuestas · WHEN el sujeto escribe el self-review del plan · THEN señala que «pregunta X» no se observa con esa petición (hoy lo da por cubierto: 1 de 1 en esta sesión).

### 2. `tests/headless/lib.sh` no sirve para una entrevista de varios turnos, ni para un molde con rutas largas

- **Qué pasó**: el tech-stack pide escribir todo lanzador sobre `lib.sh`, pero `subject_launch` lanza un solo `claude -p`. Una init necesita varios turnos, así que escribí un `driver.py` propio con `--resume`. La primera tanda falló por cosas que `lib.sh` tampoco cubre:
  - `git add -A` dio `unable to index file` en un molde calcado de un repo de templates, porque le faltaba `core.longpaths=true`;
  - `shutil.rmtree(..., ignore_errors=True)` no borró el molde anterior y no avisó;
  - `.claude/settings.json` no se puede escribir en headless ni con `Edit(.claude/**)` permitido.
- **Dónde en el kit**: `tests/headless/lib.sh` (`g`, `subject_init`, `subject_launch`) y la sección «Sujetos headless» de `.docs/sdd/tech-stack.md`.
- **Por qué el kit no lo evitó**: el lanzador de referencia solo contempla escenarios de un turno, y su `g` no pasa `core.longpaths`.
- **Coste**: 3,10 $ de la primera tanda (2 sujetos parados en el turno 2) y ~15 min de depuración del molde.
- **Propuesta**: (a) `g` con `-c core.longpaths=true`; (b) una función `subject_converse "<petición>" "<respuesta fija>" <turnos>` que reanude con `--resume <session_id>` hasta que el turno no traiga pregunta o se llegue al tope; (c) una línea en el tech-stack diciendo que `.claude/` no se mide en headless (ya añadida en este cierre).
- **Criterio de aceptación**: GIVEN un molde con una ruta de más de 260 caracteres y una petición de entrevista · WHEN una campaña usa solo `lib.sh` · THEN el molde queda commiteado y el sujeto recibe la respuesta fija turno a turno hasta cerrar (hoy: commit vacío y un solo turno).

### 3. Juntar el cierre deja en `tasks.md` un sha que ya no existe

- **Qué pasó**: el paso 6 de `sdd-start-feature` pide apuntar `Pasada de fix: <sha>` con el `HEAD` de la pasada (`396a67a`). El paso 10 de `sdd-end-feature` junta el cierre desde la última task, pasada de fix incluida (`commit-milestones.md`, «Cierre: … arreglos de la revisión final»). Tras el squash, `git branch --contains 396a67a` no devuelve nada, y `tasks.md` apunta a un commit inalcanzable.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 (línea `Pasada de fix:`), `skills/sdd-start-feature/references/commit-milestones.md` (tabla de hitos y «El hash en los artefactos») y `skills/sdd-end-feature/SKILL.md` paso 10.
- **Por qué el kit no lo evitó**: la línea sirve para contar el tramo durante el cierre, y nadie la reescribe después de juntar el hito.
- **Coste**: bajo hoy; una sesión posterior que lea `tasks.md` para re-revisar desde ese sha no lo encontrará en la historia.
- **Propuesta**: al juntar el cierre, las líneas `Pasada de fix:` y `Re-revisión:` que apuntan a commits del tramo juntado se reescriben con el sha del commit de cierre, o se anotan «(juntado en <sha de cierre>)».
- **Criterio de aceptación**: GIVEN una feature con `Pasada de fix: <sha>` en `tasks.md` · WHEN `sdd-end-feature` junta el cierre · THEN todo sha de `tasks.md` es alcanzable desde la rama (`git merge-base --is-ancestor <sha> HEAD`).

### 4. La suite completa lanzada desde Git Bash da 3 fallos que no son reales

- **Qué pasó**: el gate de cierre desde Git Bash dio 965/3: los 3 fallos eran de `Measure-SessionTokens.Tests.ps1` y comparaban «—» con «-». Desde la herramienta PowerShell pasó 968/0. Tuve que diagnosticarlo y repetir una suite de ~5 min.
- **Dónde en el kit**: `tests/Measure-SessionTokens.Tests.ps1`, en los tests de «sin -ProjectsRoot» que llegaron con el patch 0090.
- **Por qué el kit no lo evitó**: el tech-stack avisa de `ibm437` para la salida del script, pero estos tests comparan un literal leído con la página de códigos de la consola que los lanza.
- **Coste**: ~10 min (una suite extra y el diagnóstico).
- **Propuesta**: que esos tests fuercen UTF-8 en la lectura, como ya hace el que lanza un `pwsh` hijo con consola `Latin1`. El tech-stack ya dice, desde este cierre, que el gate se lanza desde PowerShell.
- **Criterio de aceptación**: GIVEN Git Bash con la página de códigos por defecto · WHEN se ejecuta `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` · THEN 0 fallos (hoy 3).

## Lo que hice por iniciativa propia

- **RED antes de escribir la spec, con la spec aprobada por delegación**: el alcance salió de lo que falló, y la guía de un «modo sobre template», que parecía necesaria, se descartó porque el RED ya lo pasaba. Funcionó: la edición final son dos filas y una renumeración.
- **Renombrar los `CLAUDE.md` copiados en `red/out/` y `green/out/` a `claude_md.md`**: guardados con su nombre, Claude Code los podría cargar como instrucciones anidadas al leer esas carpetas. Candidato para `subject_keep` de `lib.sh`.
- **Entregar en el walkthrough el prompt de la pareja en el otro repo** (§4.3), en vez de tocar un checkout ajeno que tenía una rama viva.

## Funcionó, no tocar

- La primera pregunta de `sdd-start-feature` con la opción «apruebo la spec por delegación»: sin paradas intermedias hasta la revisión final.
- La rúbrica de review de la spec («ninguna» con 2 señales y ~30 líneas) junto con el repaso de coherencia.
- El revisor final con Opus y effort high, sobre el paquete con exclusiones de `encargo-revision.md` (46 KB): cazó los dos Important.
- La parada por desvío en `delegate`: las dos enmiendas en una sola `AskUserQuestion`, con recomendación, y se resolvieron en un turno.
- `Measure-SessionTokens.ps1` sin `-ProjectsRoot` midió la sesión con `CLAUDE_CONFIG_DIR` fuera de `~/.claude`: evidencia para la validación diferida del patch 0090.
- `Invoke-SddMerge.ps1 -Push`: fusión y publicación en una sola orden.

## Errores míos, no huecos del kit

- El repaso de coherencia sí buscó los números de pregunta fuera de la spec, pero recorté la salida del `grep` con `cut -c1-160` y leí «pregunta 1» donde ponía «pregunta 17». Por eso dejé `estructura.md` fuera del Scope con un motivo falso.
- En el primer lanzamiento, el `brief.md` estaba en una ruta distinta de la que leía el driver. No costó dinero.
