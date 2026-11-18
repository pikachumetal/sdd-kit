---
kit_version: 3.0.2
lane: feature
id: 20261118-221510-feature-0355-kit-policy-inventory
task: 0355
mode: spike
date: 2026-11-18
---

# Ticket para el kit — feature 0355: spike de inventario de la política que el kit dicta a los proyectos

## Contexto

- Carril y modo: feature, spike, perfil `delegate`
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-grilling`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio repo del kit (skills en Markdown y CLI en Node), una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-sonnet-5-5 (revisor de la enmienda), claude-opus-5-5 (eje Spec y re-revisión)
- Coste en reloj: 0,73 h frente a 2 h estimadas
- Coste en tokens: 43.970.089 del hilo y 8.965.142 de subagentes; 19,88 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La spec de un spike fijó un método de lectura sin medirlo, y en la Task 1 resultó ser el enfoque que la misma spec descartaba

- **Qué pasó**: la decisión 8 de la spec decía «se lee entero cada fichero con un acierto del barrido», y el Approach descartaba leer todo el kit por contexto. Al correr el barrido en la Task 1: 76 ficheros con acierto, 96.245 de 102.745 palabras. Paré por desvío, escribí la enmienda, la revisó un subagente Sonnet (10 hallazgos, 9 aceptados) y el dev-lead la aprobó. El barrido es un comando de segundos que pude correr antes del gate.
- **Fuente**: `spec.md` de la 0355, «Enmiendas» y decisión 8; `node measure.mjs sweep` → `ficheros: 100 · … · palabras leídas: 55674 de 102745` tras la enmienda; `walkthrough.md` §3.
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md`, párrafo «What is retired or changes form» («each count of a check it fixes against what running it gives»); `skills/sdd-templates/templates/spec-template.md`, «Forma spike».
- **Por qué el kit no lo evitó**: la regla de contrastar cada recuento con lo que da ejecutarlo existe en el repaso de coherencia, pero habla de lo que se retira; la forma spike no pide medir el método antes del gate, y no la apliqué al método.
- **Coste**: una parada de desvío, un revisor Sonnet (121.901 tokens, 1 min) y la reescritura de las decisiones 1, 8 y 11 (`spec.md`, «Hallazgos de la review de la enmienda»).
- **Propuesta**: en la forma spike, una línea: si el método depende de un barrido o un recuento que se puede correr en seco, la spec lleva su cifra medida antes del gate.
- **Verificada**: sí — contrastado con `skills/sdd-templates/templates/spec-template.md`, «Forma spike» (Pregunta, Objetivos, Decisión que desbloquea, Peor carga: nada sobre medir el método)
- **Criterio de aceptación**: GIVEN un spike cuyo método lee «cada fichero que nombra un marcador» WHEN `sdd-propose` presenta la spec THEN la spec cita el número de ficheros y palabras que da el barrido, y el Approach no descarta lo que el método acaba siendo.

### 2. Un ruling cambió en silencio una decisión aprobada de la spec, y la revisión final lo cazó con piezas perdidas

- **Qué pasó**: con la enmienda aprobada («por sección en cada fichero con un acierto fuerte»), apunté como `Ruling:` leer solo la línea del acierto en 31 ficheros cuyos aciertos me parecieron falsos positivos. El eje Spec encontró aciertos reales en 6 de ellos y piezas perdidas (Important 1), más una afirmación falsa en `research.md` («todos eran falsos positivos»).
- **Fuente**: ledger de la Task 1 (`tasks.md` §Rulings de la 0355, segundo ruling); informe del eje Spec, Important 1; `research.md` §2 «Método y límite».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings» («Deviation: a change to the approved spec…»).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: leer menos de lo que la decisión 8 aprobada dice es cambiar la spec, no salir del plan.
- **Coste**: parte de la pasada de fix de la revisión final (7 Important, 7 Minor) y releer 6 ficheros (`walkthrough.md` §3; commit de cierre `205802dc7`).
- **Propuesta**: en «Deviations and rulings», un contraejemplo: «leer, medir o probar menos de lo que una decisión aprobada fija es un desvío, aunque lo saltado parezca vacío».
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec aprobada que fija «se lee por sección» WHEN el ejecutor quiere leer solo la línea del acierto THEN para con 🦆 y ✋ como desvío, sin apuntar un `Ruling:`.

### 3. En `delegate`, la feature arrancó sin la nota de entendimiento ni `sdd-grilling`, y el dev-lead lo paró

- **Qué pasó**: anuncié el carril y pasé a escribir la spec sin la nota de entendimiento («lo que entendí, corrígeme») y sin cargar `sdd-grilling`, poniendo en ✋ dos decisiones que eran del dev-lead (el alcance y qué hace el kit sin la skill del proyecto). El dev-lead preguntó «no me has hecho ninguna pregunta en el grilling, ¿por qué?»; las dos preguntas que hice después cambiaron el alcance de la spec.
- **Fuente**: `skills/sdd-propose/SKILL.md` paso 4 («Before the interview's first question, invoke `sdd-grilling`… your first message after classifying is the understanding note»); `spec.md`, «Decisiones tomadas con el dev-lead», dos líneas del 2026-11-18.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4; `skills/sdd-propose/references/control-profiles.md`, perfil `delegate`.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: leí `delegate` («decide tú lo de método») como permiso para no entrevistar. Segundo caso del mismo patrón: la fila 0356 del roadmap («En `delegate`, la entrevista pregunta lo que falta») nació hoy de otra sesión.
- **Coste**: una parada del dev-lead y un turno; sin respaldo en minutos.
- **Propuesta**: lo resuelve la 0356; este ticket es su segundo caso.
- **Verificada**: sí — contrastado con `skills/sdd-propose/SKILL.md` paso 4 y la fila 0356 de `ROADMAP.md`
- **Criterio de aceptación**: GIVEN una feature spike en `delegate` con una decisión de alcance que solo el dev-lead puede tomar WHEN `sdd-propose` sale del paso 2 THEN el primer mensaje es la nota de entendimiento, y la decisión de alcance va como pregunta de `sdd-grilling`, no al ✋.

### 4. Con la CI de la base en rojo, paré con opciones sin leer la aserción que fallaba

- **Qué pasó**: la CI de `develop` estaba en rojo. Leí el log cortado a 220 caracteres (`AssertionError: [r1-1] no se pudo leer oa…`) y paré con dos opciones y una causa supuesta. El dev-lead: «¿en serio no has sido capaz tú solito de ver eso de 3.0.2?». La aserción completa (`expected '3.0.1' to be '3.0.2'`) y la línea del molde salían con un comando más. Además, `develop` llevaba tres runs seguidos en rojo desde el corte de la 3.0.2 sin que nadie lo viera hasta este cierre.
- **Fuente**: `gh run view <id> --log-failed` en PowerShell → `expected '3.0.1' to be '3.0.2'` en `molds.test.ts:95`; `gh run list --workflow ci.yml --branch develop -L 3` → tres `failure` (`fed104883`, `d100f814a`, `7f770edc8`).
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md`, «The base's CI» (con `failure`: no fusionar, buscar en la deuda, abrir fila); no pide nombrar la causa.
- **Por qué el kit no lo evitó**: la receta manda parar y abrir fila, pero no leer la aserción que falla; una fila de deuda sin causa se queda en «CI en rojo».
- **Coste**: un turno del dev-lead; el patch 0358 lo hizo otra sesión.
- **Propuesta**: en «The base's CI», con `failure`, la línea del mensaje final lleva el test y la aserción completa de `gh run view <id> --log-failed`, no solo el `headSha`.
- **Verificada**: sí — contrastado con `skills/sdd-archive/references/merge-recipe.md`, «The base's CI»
- **Criterio de aceptación**: GIVEN la CI de la base en `failure` por un test WHEN el cierre para el merge THEN el mensaje final nombra el test, la línea `expected … to be …` y el fichero:línea, antes de ofrecer opciones.

## Lo que hice por iniciativa propia

- Un script (`measure.mjs`) que calcula el manifiesto de lectura y las palabras de cada pieza por rango, en vez de contarlas a mano: las sumas cuadran por construcción y la revisión pudo reproducirlas. Funcionó.
- Contrastar el inventario con las fuentes del kit (`$SDD_UPSTREAM_DIR`) y con dos repos del equipo, por petición del dev-lead: dio la evidencia de campo de `research.md`. Funcionó.

## Funcionó, no tocar

- La parada por desvío con revisor Sonnet sobre la enmienda: 9 de 10 hallazgos aceptados antes de volver al dev-lead.
- El eje Spec en Opus sobre un spike: cazó lo que el ruling escondía, y la re-revisión única cerró sin abrir otra.
- La regla 7 del repo (CI de la rama antes de fusionar) y `sdd merge --sync` tras el patch de la base: el merge salió limpio a la primera.

## Menores

- Una cadena con tabuladores escrita con un here-string de comillas dobles en PowerShell perdió un tabulador en `pieces.tsv`; el script lo cazó — no localizado (shell).
- `node measure.mjs table` reescribe `out/tables.md` con LF sobre un fichero en CRLF y `git status` lo da por modificado sin cambio de contenido — no localizado.
