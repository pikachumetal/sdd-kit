---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260929-152455-feature-0096-closing-off-critical-path
task: 0096
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0096: el cierre en paralelo funcionó; los huecos están en el arnés de campañas y en las exenciones de revisión

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native con cinco tasks
- Skills del kit usadas: using-sdd, sdd-start-feature, sdd-templates, sdd-end-feature, sdd-feedback (y de superpowers: brainstorming, writing-plans, executing-plans, test-driven-development)
- Proyecto: el propio kit (skills en Markdown, scripts PowerShell, Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus con `effort-high` (revisor final); sujetos de campaña Sonnet
- Coste en reloj: ~2,2 h desde la spec hasta el merge
- Coste en tokens: hilo 43,9 M, subagentes 3,4 M (16,83 $); sujetos 9,39 $ en 17

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La comprobación previa de un escenario no mira si el molde dispara otro freno del kit

- **Qué pasó**: en el escenario c4, que medía la re-revisión de un commit hecho mientras revisaba el revisor final, el commit del molde añadía un error nuevo («Falta la sala»). Eso cambia la salida observable, saltó el freno de alcance y el sujeto paró a preguntar por ese motivo, así que no midió lo que se buscaba. Hubo que descartarlo, rehacer el molde con un refactor sin cambio de salida y pedir al dev-lead que subiera el techo de sujetos de 15 a 17.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Sujetos headless», punto «Comprobación previa de cada escenario» (siete preguntas).
- **Por qué el kit no lo evitó**: la pregunta (6) mira si el molde ofrece una salida que la guía nueva quiere cerrar, no si el estado del molde activa otra parada del kit (freno de alcance, desvío, gate) antes de llegar a lo medido.
- **Coste**: 1 sujeto (0,32 $), una parada del dev-lead para subir el techo y ~15 min.
- **Propuesta**: una octava pregunta: «¿el estado del molde dispara otra parada del kit (freno de alcance, desvío, gate) antes del paso que se mide? Si la dispara, el molde se cambia hasta que no la dispare».
- **Criterio de aceptación**: GIVEN un molde con un commit del hilo que cambia un mensaje de error y un escenario que mide la re-revisión del tramo, WHEN el autor de la campaña pasa la comprobación previa, THEN la pregunta (8) señala el freno de alcance antes de lanzar. Hoy la lista de siete preguntas lo deja pasar.

### 2. Un hook que deniega `Agent` hace parar al sujeto si lo medido viene después del veredicto

- **Qué pasó**: el primer sujeto de c2 (cierre con un cambio pedido tras la validación) intentó la re-revisión. El hook de referencia de la 0085 la denegó y el sujeto paró «hasta que haya re-revisión», sin llegar al walkthrough, que era lo que se medía. Se relanzó con un hook nuevo (`clean-review.mjs` en la carpeta de la 0096) que guarda el encargo y deniega con un veredicto limpio en el motivo.
- **Dónde en el kit**: `tests/headless/` (no hay hook de referencia; cada campaña copia el de la 0085) y `.docs/sdd/tech-stack.md` («Sujetos headless», ya con el aprendizaje de esta sesión).
- **Por qué el kit no lo evitó**: el único hook reutilizado deniega sin veredicto, y ninguna regla dice cuándo sirve.
- **Coste**: 1 sujeto (0,42 $) y un relanzamiento.
- **Propuesta**: llevar los dos hooks a `tests/headless/` como piezas de referencia, `deny-agent.mjs` (lo medido es el despacho o su encargo) y `verdict-agent.mjs` con el veredicto por variable de entorno (lo medido viene después), con su caso en `HeadlessLauncher.Tests.ps1`.
- **Criterio de aceptación**: GIVEN una campaña de cierre cuyo escenario mide el walkthrough tras una re-revisión, WHEN el `subject.sh` usa el hook de veredicto de `tests/headless/`, THEN el sujeto llega al walkthrough sin parar. Hoy, con el de denegar, 1 de 1 paró (`red/out/c2-1-descartado.texts.txt` de la 0096).

### 3. `task-done` aborta en silencio si el comando de verificación no imprime nada

- **Qué pasó**: en la Task 1 (evidencia de campaña), `task-done … -- test -s tests/<evidencia>.md` salió con código 1, sin mensaje y sin escribir la línea del ledger. El script hace `grep -v '^[[:space:]]*$' "$log" | tail -n 1` con `set -euo pipefail`: con el log vacío, `grep` sale con 1 y aborta. Funcionó con un comando que imprime (`grep -c …`).
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6, párrafo de Native («`task-done` con el comando de su «Verificación»»). El script es de superpowers (`executing-plans/scripts/task-done`, 6.4.2).
- **Por qué el kit no lo evitó**: el paso da por hecho que la «Verificación» de una task es una suite que imprime. En una task de solo evidencia, lo natural es una comprobación muda.
- **Coste**: ~3 min y un rodeo; el riesgo es dar la task por registrada sin la línea `complete`.
- **Propuesta**: en el paso 6, una frase: «el comando de `task-done` tiene que imprimir algo (`grep -c`, `wc -l`); uno mudo, como `test -s`, hace que el script salga sin registrar la task y sin decirlo». Y reportar el caso a superpowers (hueco demostrado, Art. IX 3).
- **Criterio de aceptación**: GIVEN una task Native cuya «Verificación» es una comprobación de fichero, WHEN el hilo la cierra con `task-done`, THEN el ledger tiene su línea `complete`. Hoy, con `test -s`, no la tiene y el script no dice nada.

### 4. La exención «revisado en el hilo» no cubre la evidencia de las campañas

- **Qué pasó**: tras la pasada de fix había que añadir a `tests/closing-off-critical-path-*.md` las tablas del escenario c4 (solo texto de evidencia). Esos ficheros no están bajo `.docs/` ni son `*.md` de la raíz, así que un commit propio habría abierto una re-revisión Opus. Para evitarlo, la evidencia se metió con `--amend` en el commit de la pasada, lo que cambió su sha. Ese sha ya estaba escrito en la evidencia, y hubo que amendar otra vez (hallazgo 5).
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 («salvo el commit de solo docs y de menos de 20 líneas… todos sus ficheros bajo `.docs/` o `*.md` de la raíz»), paso 7 y `references/control-profiles.md` («Excepción»).
- **Por qué el kit no lo evitó**: la exención se escribió con la documentación de un proyecto en mente. Las carpetas de evidencia que un proyecto declara en `tech-stack.md` (las que `encargo-revision.md` ya excluye del paquete) no entran.
- **Coste**: dos `--amend`, un sha perdido y ~5 min. Sin el rodeo, una re-revisión Opus (~2 $, ~8 min) de un texto de tablas.
- **Propuesta**: la exención incluye los ficheros de las carpetas de evidencia que declara `tech-stack.md`, con el mismo tope de líneas o uno propio para tablas de evidencia.
- **Criterio de aceptación**: GIVEN un commit del hilo posterior a la pasada de fix que solo añade 16 líneas a `tests/<skill>-green.md`, carpeta de evidencia declarada, WHEN el hilo va a presentar la validación, THEN lo anota como `revisado en el hilo` y no despacha revisor.

### 5. Segundo caso de sha citado fuera de `tasks.md` que el propio flujo borra

- **Qué pasó**: la evidencia del GREEN citaba «kit en `b783873`», el sha de la pasada de fix. El `--amend` del hallazgo 4 lo dejó fuera de la rama. Se vio a tiempo y se cambió por «kit de la pasada de fix». Es el mismo mecanismo que la fila de deuda nueva «El walkthrough cita shas del tramo que el cierre junta» (RED c2 de la 0096), que espera un segundo caso.
- **Dónde en el kit**: `skills/sdd-start-feature/references/commit-milestones.md` («El hash en los artefactos»), que tras la 0096 solo cubre `tasks.md`.
- **Por qué el kit no lo evitó**: el criterio «todo sha alcanzable» se escribió para `tasks.md`. El walkthrough y la evidencia citan shas del tramo que se junta o se amenda con la misma facilidad.
- **Coste**: bajo, porque se vio antes del merge.
- **Propuesta**: extender el criterio a todo artefacto de la carpeta de la spec y a la evidencia: tras el commit de cierre, `git merge-base --is-ancestor` sale bien para todo sha citado; los de un tramo juntado se nombran por su hito («la pasada de fix») y no por su sha.
- **Criterio de aceptación**: GIVEN un walkthrough que cita el sha de la pasada de fix, WHEN se junta el cierre, THEN el sha que queda en el walkthrough es alcanzable o no hay sha. Hoy 1 de 2 sujetos de c2 no juntó el cierre para no perderlo, y esta sesión lo perdió una vez.

### 6. Un conflicto de los registros en la misma línea, con cambios que no se pisan, para siempre en una persona

- **Qué pasó**: en el merge del cierre, `develop` había añadido una frase al final de una fila de deuda y la rama había cambiado un enlace en medio de la misma fila. La receta dice que, si los dos lados tocan la misma línea, es de una persona. Se paró a preguntar, el dev-lead eligió combinar, y se combinó a mano. Además, git agrupó en el mismo trozo la fila vecina, que solo había cambiado en `develop`, y hubo que separarlas.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «Conflicto solo en los registros», pasos 3 y 4.
- **Por qué el kit no lo evitó**: la regla no distingue «dos cambios en la misma línea que se solapan» de «dos cambios en partes distintas de la misma fila».
- **Coste**: una parada del dev-lead y ~6 min.
- **Propuesta**: medir primero si pasa más veces (hoy, un caso). Si se repite, la receta permite combinar cuando el diff por palabras de cada lado contra la base no se solapa, y lo dice en el mensaje final; si se solapa, sigue siendo de una persona.
- **Criterio de aceptación**: GIVEN una fila de deuda en la que `develop` añade una frase al final y la rama cambia un enlace en medio, WHEN el script falla con `merge: conflicto en .docs/sdd/roadmap.md`, THEN el hilo combina los dos cambios sin preguntar y lo nombra en el mensaje final.

## Lo que hice por iniciativa propia

- **Lancé el gate completo en segundo plano a la vez que el revisor final**, como el ticket de la feature 0001. Acabó antes que el revisor (407 s frente a 8 min). Segundo caso para la 0097.
- **Vi el RED de una task fallar a posteriori** contra los ficheros de la base extraídos con `git show <sha>:<ruta>` y `SDD_KIT_ROOT` apuntando a esa copia, porque `git worktree add` del repo en el scratchpad falla con «Filename too long». Funcionó y dejó el RED probado. Queda en `tech-stack.md`.
- **Usé la regla nueva en la propia feature**: el revisor final en un worktree desanclado (`git -c core.longpaths=true worktree add` junto a los demás worktrees) y los borradores de cierre escritos mientras revisaba. Encajó con la receta del paquete sin tocarla.
- **Ante un baseline limpio cuya conducta salía de la petición** (c4-2 nombraba el commit intermedio), lancé otro sujeto con la petición realista antes de recortar, como pide el Art. I. Confirmó el recorte (c4-3).

## Funcionó, no tocar

- La primera pregunta de `sdd-start-feature` resolvió en un turno carril, modo, perfil y partición, con el recuento de tasks.
- En `delegate`, las paradas fueron exactamente las útiles: la spec, dos desvíos (las dos enmiendas que salieron del RED y de la revisión final), el techo de la campaña, la validación y el conflicto del merge.
- `Test-Capabilities.ps1 -Artifact` detectó que la capacidad no tenía el AND añadido por la segunda enmienda.
- `Invoke-SddMerge.ps1` más la receta del conflicto en registros: merge, verificación y push en una llamada tras el merge de sincronización.
- El vigía de silencio devolvió `TERMINADO` sin falso aviso durante los 8 min del revisor final.

## Errores míos, no huecos del kit

- Edité los ficheros de la Task 4 sin haber corrido antes sus tests RED. Lo cubrí a posteriori contra la base, pero el orden estaba mal.
- Escribí a mano una base del rango en el encargo del revisor final (`f6e3ea06`) en vez de copiarla de la cabecera del paquete (`94dc27f3`). Lo corregí por mensaje mientras revisaba.
- Varios `sed` y `python` con escapes mal puestos en el `subject.sh` fallaron en el ensayo en seco antes de lanzar ningún sujeto.
