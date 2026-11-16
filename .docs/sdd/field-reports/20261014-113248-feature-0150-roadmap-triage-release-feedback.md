---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261014-113248-feature-0150-roadmap-triage-release-feedback
task: 0150
mode: full
date: 2026-10-14
---

# Ticket para el kit — feature 0150: la campaña RED midió con la spec a la vista, el delta no vio dos requisitos vivos y los vigías fallan al reanudar y al acabar

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, ejecución SDD (subagentes)
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-rubber-duck` (modo corto), `sdd-parallel-agents` (revisión de la spec), `sdd-start-feature`, `sdd-implement` (SDD), `sdd-worktrees`, `sdd-tdd`, `sdd-templates`, `add-to-changelog`, `sdd-end-feature`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown y CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: implementadores y revisores de task sonnet; revisor final opus con `sdd-kit:effort-high`; revisores de la spec opus (dominio) y sonnet (técnica); sujetos headless sonnet
- Coste en reloj: 2,4 h frente a 4,5 h estimadas, más ~2,8 h de spec y plan
- Coste en tokens: hilo 209.902.163 y subagentes 22.624.834 en 17 despachos; sesión 73,73 $ y sujetos 12,37 $ en 65

Fuente de la cabecera y del contexto: `.docs/sdd/sdd-kit.json` → `"version":"2.3.4"`; `installed_plugins.json` de Claude Code → `superpowers@superpowers-marketplace`, entrada del checkout del kit, `"version": "7.0.0"`; `mode: full` en el frontmatter de la spec; walkthrough de la 0150, §2 (tiempos, tokens de `sdd session tokens` y coste de sujetos).

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La copia del kit de la campaña RED llevaba `.docs/`, y dos sujetos leyeron la spec que se estaba midiendo

- **Qué pasó**: la copia del kit del RED salió de `git archive` del commit de apertura entero, con `.docs/` y `tests/`. m3-1 y m3-2 leyeron desde esa copia las secciones de triaje de la spec de esta feature (`grep -n -i "triar\|debt\|deuda" .docs/sdd/specs/<carpeta de la 0150>/spec.md`), así que su RED medía la regla ya escrita. Los aparté y relancé m3 con una copia sin `.docs/` ni `tests/`. `subject_init` comprueba que la skill medida está en la copia, pero no que falten la carpeta de specs y las pruebas.
- **Fuente**: `tests/sdd-roadmap-0150-red.md:38` (la contaminación y el `grep` de los sujetos) y `:3` («10 sujetos válidos y 2 apartados»); el log de la campaña en el scratchpad → `sujetos de la campaña: 9 · coste acumulado: 1.98 $` antes del relanzamiento y `sujetos de la campaña: 11 · coste acumulado: 2.36 $` después; `tests/headless/lib.sh:34`, la única comprobación de la copia («sin la skill $4 en la copia del kit»); `.docs/sdd/tech-stack.md:86` (`git archive <commit ya revisado> skills .claude-plugin`).
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Baterías por skill», línea 86, que da la forma `git archive … skills .claude-plugin` solo para el frente del GREEN que corre mientras se revisa otra task; y `tests/headless/lib.sh`, `subject_init`.
- **Por qué el kit no lo evitó**: la forma correcta existía, pero en la regla de un caso concreto, y el lanzador no la comprueba. No la apliqué al RED.
- **Coste**: 2 sujetos apartados y el relanzamiento de m3, 0,38 $ y ~3 min (walkthrough de la 0150, §3, «Decisiones tomadas sin el dev-lead»).
- **Propuesta**: `subject_init` aborta si la copia del kit tiene `.docs/` o `tests/`, con un mensaje que dé la forma `git archive <commit> skills .claude-plugin`, y su caso en `tests/HeadlessLauncher.Tests.ps1`. La regla de la línea 86 pasa a valer para toda copia del kit de una campaña. Ya tiene fila de deuda en el roadmap, abierta en el cierre de la 0150.
- **Verificada**: sin verificar (contrastado con `tests/headless/lib.sh:34`).
- **Criterio de aceptación**: GIVEN una copia del kit con `.docs/sdd/specs/`, WHEN `subject_init` la recibe, THEN aborta antes del `claude -p` y nombra la forma correcta; hoy lanza el sujeto.

### 2. El delta de la spec no vio dos requisitos vivos que nombraban `ROADMAP.md` en un AND

- **Qué pasó**: la decisión 19 de la spec declaraba MODIFIED solo los requisitos que dicen una sección, una celda o una columna que en `ROADMAP.md` no existe. Dos requisitos de `roadmap`, «Una fila saldada antes de la última release está de más» y «Un patch publicado sale de «Patches» en el corte», aceptaban en su último AND un enlace «desde `ROADMAP.md`» que la forma 3.0.0 ya no puede dar. Ni la pasada de coherencia ni los dos revisores de la spec lo vieron. Salió en la Task 3, al implementar el check, y paró al dev-lead por desvío.
- **Fuente**: `spec.md` de la 0150, línea 79 (decisión 19); `git show bc53694a:.docs/sdd/capabilities/roadmap.md | grep -n 'ROADMAP.md'` → la línea 40, el AND con «desde `ROADMAP.md`»; commit `246b45a1` (la enmienda); el transcript de la sesión → pregunta a las 13:03:54 UTC y respuesta a las 13:06:25.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, «Coherence pass» del paso de la spec (línea 62), y `skills/sdd-start-feature/references/review-spec.md`.
- **Por qué el kit no lo evitó**: la pasada de coherencia contrasta los literales que se repiten dentro de la spec, no los de las capacidades vivas que la spec no cita. Un AND al final de un requisito largo no sale leyendo los títulos.
- **Coste**: una parada por desvío (~3 min de espera del dev-lead), la reanudación del implementador de la Task 3 y un test lento retirado (commit `246b45a1`; walkthrough de la 0150, §3).
- **Propuesta**: en la pasada de coherencia, si la spec cambia la forma o el sitio de un documento, buscar su nombre en `capabilities/` y decidir cada requisito que lo nombre: en el delta (MODIFIED o REMOVED) o en una decisión con su motivo.
- **Verificada**: sí — `git show bc53694a:.docs/sdd/capabilities/roadmap.md | grep -n 'ROADMAP.md'` en Git Bash da la línea 40.
- **Criterio de aceptación**: GIVEN una spec que cambia la forma de `ROADMAP.md` y una capacidad viva con un AND sobre un enlace «desde `ROADMAP.md`», WHEN se escribe el delta, THEN ese requisito sale en el delta o en una decisión antes de aprobar la spec.

### 3. La caché de moon ocultó 14 tests en rojo de `cli:test` en `develop`

- **Qué pasó**: al commitear la Task 3, el pre-commit cayó en 14 tests de `docs-claims.test.ts` sobre `skills/sdd-implement/SKILL.md`, que la Task 3 no tocaba. Venían de `develop`: el cierre de la 0175 devolvió a `sdd-implement` grafos con etiquetas como «sdd task start: brief + BASE», y el parser tomaba «start:» como verbo. Los pre-commits de después no lo vieron porque moon sacaba `cli:test` de la caché: sus entradas no incluyen `skills/`, y `docs-claims` lee las skills.
- **Fuente**: mensaje del commit `27c21490`; `cli/moon.yml`, la tarea `test` sin `inputs`; `.githooks/pre-commit` → `moon run cli:typecheck cli:test kit:test-fast kit:roadmap`.
- **Dónde en el kit**: `cli/moon.yml`, tarea `test`.
- **Por qué el kit no lo evitó**: `cli:test` lee ficheros de fuera de su proyecto (`skills/` y `.docs/sdd/capabilities/`), y moon, sin `inputs`, solo mira los ficheros de `cli/`.
- **Coste**: un arreglo fuera de alcance en la Task 3 (`27c21490`, ~3 min), y `develop` en rojo desde el cierre de la 0175 sin que ningún pre-commit lo dijera (mensaje de `27c21490`).
- **Propuesta**: `inputs` de `cli:test` con `skills/**` y `.docs/sdd/capabilities/**`, además de los de `cli/`. Ya tiene fila de deuda en el roadmap.
- **Verificada**: sí — contrastado con `cli/moon.yml`: `test` no declara `inputs`. El acierto de caché no se reprodujo.
- **Criterio de aceptación**: GIVEN un cambio solo en `skills/sdd-implement/SKILL.md` que rompe `docs-claims`, WHEN el pre-commit corre `moon run cli:test`, THEN la tarea se ejecuta y falla; hoy sale de la caché en verde.

### 4. La rúbrica de una batería deja casos que el THEN de la spec sí decide

- **Qué pasó**: tres filas de la rúbrica escritas en la Task 1 no decidían casos que salieron al calificar. F1 (`sdd-feedback`): si mira el ticket entero o solo «Qué pasó». M5 (`sdd-roadmap`): si cuenta una fila propuesta que espera la decisión en `delegate`. M6: si falla cuando un ítem triado va a «Próximo» sin su fila de «Deuda técnica». Los desempaté con el THEN de la spec antes de calificar, y M6 dejó m6-2 en rojo. Es el segundo caso: en la 0175, la batería calificó `w1` con menos filas de las que decía la spec.
- **Fuente**: `tests/sdd-roadmap-0150-green.md:58` («Desempates de la rúbrica antes de calificar») y `:19` (m6-2, «falla (desempate)»); walkthrough de la 0150, §3; `.docs/sdd/field-reports/20261013-100039-feature-0175-restore-fork-pieces.md`, «Menores» (la de `w1`).
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Comprobación previa de cada escenario» (línea 136): sus siete preguntas miran el molde y la petición, ninguna la rúbrica.
- **Por qué el kit no lo evitó**: ningún paso contrasta cada fila de la rúbrica con el THEN que califica, así que el caso dudoso se decide al calificar, con las salidas ya delante.
- **Coste**: tres rulings durante la calificación (walkthrough de la 0150, §3); el tiempo, sin respaldo. La ronda 2 de la Task 4 la abrió m6-2, que falla por el THEN, no por el desempate.
- **Propuesta**: una 8.ª pregunta en la comprobación previa: cada fila de la rúbrica cita el THEN que califica y dice cómo se califica el caso que ese THEN no decide, escrita en la batería antes de lanzar.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN la batería de una feature con una fila que califica una fila nueva del roadmap en `delegate`, WHEN se lanza el GREEN, THEN la fila ya dice cómo cuenta una fila propuesta que espera la decisión, y la evidencia no tiene ningún desempate escrito después de ver las salidas.

### 5. El vigía de una verificación lenta dio `SILENCIO:` tres veces sobre una campaña ya terminada

- **Qué pasó**: lancé `sdd watch command --path <log de la campaña>` junto a cada campaña de sujetos en segundo plano. Las tres campañas terminaron, el harness lo avisó y no paré sus vigías. Los tres acabaron 20 min después del último byte con `SILENCIO: <log> lleva 20 min sin escribir (umbral 20 min, longCommandMinutes)`, y las tres veces lo leí como falsa alarma.
- **Fuente**: salidas de los tres vigías en el directorio de tareas del harness (`SILENCIO: red-campaign.log …`, `SILENCIO: green-roadmap.log …`, `SILENCIO: green-final.log …`); `red-campaign.log` escrito por última vez a las 12:30:47 UTC y su `SILENCIO:` a las 12:50:58 (fecha del fichero y aviso del transcript); `skills/sdd-start-feature/references/control-profiles.md:178`.
- **Dónde en el kit**: `skills/sdd-start-feature/references/control-profiles.md`, «Vigía de silencio» (línea 178), y `cli/src/watch/watch.ts`: `watch command` solo mira la fecha del fichero.
- **Por qué el kit no lo evitó**: la regla existía («al recibir … el aviso de que terminó el comando de una verificación lenta, para su vigía») y no la apliqué ninguna de las tres veces: el aviso del comando llega con el trabajo que desbloquea, y parar el vigía es un paso suelto que nada recuerda.
- **Coste**: tres notificaciones falsas, cada una con su turno de lectura (~1 min en total, transcript de la sesión). El riesgo es mayor: un `SILENCIO:` real se leería como el de siempre.
- **Propuesta**: que el vigía no dependa del hilo. `sdd watch command -- <comando…>` lanza el comando, guarda su salida y termina con `TERMINADO: <comando> salió con <rc>` al acabar, o con `SILENCIO:` si deja de escribir: una sola tarea en segundo plano.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una campaña lanzada con su vigía, WHEN la campaña termina, THEN el vigía termina con `TERMINADO:` en el mismo minuto; hoy da `SILENCIO:` 20 min después (3 de 3 en esta sesión).

### 6. `sdd watch subagent` sobre un subagente reanudado termina al instante con el `TERMINADO:` de la vuelta anterior

- **Qué pasó**: las rondas de fix reanudan al implementador original, que conserva su `description`. El vigía lanzado con esa `description` encontró el transcript del mismo agente, cuya última respuesta era el `end_turn` de la vuelta anterior, y terminó con `TERMINADO: <description> devolvió su resultado` a los 3–4 s. Pasó dos de dos veces: la ronda de corrección de la Task 1 y la reanudación de la Task 3. Un `Start-Sleep` de 1 y de 2 s delante no cambió nada. Las dos vueltas reanudadas quedaron sin vigía.
- **Fuente**: salidas de los dos vigías en el directorio de tareas del harness (lanzados a las 12:23:12 y 13:07:08 UTC, terminados a las 12:23:15 y 13:07:12); `cli/src/watch/watch.ts:50-59` (`findTranscript` toma el transcript más reciente con esa `description`); `cli/src/watch/events.ts:34-37` (`isFinished`: la última respuesta del agente acaba en `end_turn`).
- **Dónde en el kit**: `cli/src/watch/events.ts`, `isFinished`; `skills/sdd-start-feature/references/control-profiles.md`, «Vigía de silencio» (un vigía en cada fix wave, y «cada despacho lleva una `description` distinta»); `skills/sdd-implement/SKILL.md`, «The fix loop» (las rondas 1–3 reanudan al implementador).
- **Por qué el kit no lo evitó**: la regla de la `description` distinta no puede cumplirse al reanudar, y `isFinished` no distingue una respuesta anterior al mensaje que reanuda.
- **Coste**: dos vueltas sin vigía; sin cuelgue, así que sin coste en reloj.
- **Propuesta**: `isFinished` solo cuenta un `end_turn` sin un mensaje `user` posterior en el transcript (o posterior al arranque del vigía); hasta entonces, `EN MARCHA`.
- **Verificada**: sí — reproducido en esta sesión, 2 de 2.
- **Criterio de aceptación**: GIVEN un transcript cuya última respuesta es un `end_turn` seguido de un mensaje `user` que reanuda al agente, WHEN el vigía lo lee, THEN da `EN MARCHA`, no `TERMINADO:`; un test de `subagentVerdict` con ese transcript fijo lo cubre.

### 7. `sdd merge --push` publicó tres commits de `develop` que no eran de la feature

- **Qué pasó**: antes del merge, el `develop` local llevaba tres commits del roadmap sin publicar, hechos en otro checkout. `sdd merge --push` fusionó sobre ese `develop` y lo empujó entero, así que publicó también esos tres. Lo vi antes, al comprobar la base, y no pregunté; lo dije en el mensaje final.
- **Fuente**: `git log --oneline origin/develop..develop` a las 14:05 UTC → tres commits `docs(roadmap)`; `node cli/bin/sdd.js merge --project-root . --push` → `Fusionado feature/0150-roadmap-triage-release-feedback en develop: 7fd2fe52` y `publicado en origin`; `skills/sdd-end-feature/references/merge-recipe.md:28` («publica solo la rama destino, por su nombre»).
- **Dónde en el kit**: `cli/src/merge/run.ts` (`pushDestination`) y `skills/sdd-end-feature/references/merge-recipe.md`, «Push».
- **Por qué el kit no lo evitó**: la receta dice qué rama se publica, no qué commits. Con `merge.push: true` en `delegate` nadie confirma, y el script no avisa de los commits locales de la rama destino que no son de la feature. El paso 10 de `sdd-end-feature` pide confirmar «cualquier otro push».
- **Coste**: ninguno observado (eran del dev-lead y tocaba publicarlos). El riesgo es publicar trabajo local a medias de otra sesión.
- **Propuesta**: antes de empujar, `sdd merge` mira `origin/<destino>..<destino>` sin la feature. Si no está vacío, fusiona sin empujar y acaba con `push: no hecho: <n> commits locales de <destino> que no son de la feature: <shas>`; el mensaje final lo cita y el dev-lead decide.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un `develop` local con un commit que no está en `origin/develop` ni en la feature, WHEN `sdd merge --push`, THEN el merge se hace, el push no, y la salida nombra el commit.

## Lo que hice por iniciativa propia

- Vi el choque de la fila 0152 en la comprobación de la base de la Task 5 y se lo pregunté al dev-lead mientras corría el gate de cierre, antes de lanzar `sdd merge`. La parada no alargó el cierre.
- Esperé a los controles del REFACTOR antes de despachar la revisión final, para que la evidencia GREEN entrase en su paquete. Funcionó: la revisión final la cubrió y no hizo falta una re-revisión aparte.
- Repetí m5 y m2 con 2 sujetos (0,46 $) tras la pasada de fix, porque cambió una frase que ya se había medido. Ninguna regla lo pide; salieron limpios.
- Escribí los desempates de la rúbrica en la evidencia antes de calificar (hallazgo 4).

## Funcionó, no tocar

- El RED sacó dos reglas antes de escribirlas: el contraste de datos del triaje y el prompt desde el brief no se escribieron porque m3, m3b y m4 salieron limpios con el kit de la apertura.
- La partición en tres al abrir: la 0150 quedó en cinco tasks y cerró en 2,4 h frente a 4,5 h.
- SDD con implementadores sonnet y el contrato en el plan: de 2 a 20 min por task.
- La revisión final (opus, effort high): seis hallazgos subidos a Important por su efecto, arreglados en una pasada y con la re-revisión limpia.
- La comprobación de la base antes de cada task vio en la Task 5 que `develop` había editado la fila 0152, una hora antes del merge.
- La receta del conflicto en los registros: merge de sincronización, cada fila con su lado, y el relanzamiento pasó a la primera.
- Las paradas de `delegate` cayeron solo en la spec, en los dos desvíos y en la fila 0152.

## Menores

- El gate de cierre falló por tiempo con las suites en paralelo una de dos veces: 3 timeouts de 5 s en `cli:test` y `FastSuiteBudget` en 38,1 s con umbral de 30 s; solos pasan (walkthrough de la 0150, §4.1) — `moon.yml` y `tests/FastSuiteBudget.Tests.ps1`.
- La receta del merge manda a una persona un conflicto de la misma línea aunque sea la unión de dos listas «tras» de una fila del roadmap; fue una parada de ~3 min, hecha mientras corría el gate — `skills/sdd-end-feature/references/merge-recipe.md`, «Conflicto solo en los registros», paso 4.
- La Task 1, solo de RED, no tiene una «Verificación» que salga con 0: `DRY_RUN=1` sale con 1 por construcción, y la registré con el Pester de las baterías (ruling) — `skills/sdd-implement/SKILL.md`, `sdd task done`.
- La ronda 2 de la Task 4 llegó con la Task 5 ya juntada y quedó como commit propio, porque juntarla pedía reordenar la historia — `skills/sdd-implement/SKILL.md`, «Complete the task».
