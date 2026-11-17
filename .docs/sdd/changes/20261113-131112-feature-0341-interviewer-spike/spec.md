---
id: 20261113-131112-feature-0341-interviewer-spike
feature: 0341
title: Spike — qué postura de entrevista va en el núcleo del entrevistador del kit
mode: spike
status: approved
created: 2026-11-13
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-13
---

# Spec — Spike: qué postura de entrevista va en el núcleo del entrevistador del kit

🦆 Hoy, cuando el kit te entrevista, a veces te pregunta lo que ya dice la fila o el código, te junta dos preguntas en una o no busca lo que cambia con la versión: la medida final de la 0152 dio 8 rojos de 19 escenarios a `sdd-grilling`. Este spike prueba cinco formas de entrevistar dentro del mismo kit, cambiando solo ese texto, con escenarios de explore, init y propose, y mide antes cuánto ruido da repetir la misma forma dos veces. Cuenta cuántas veces cada una cumple lo que esperas de una entrevista: que no te dé la razón, que mire el código antes de afirmar o preguntar, que no pregunte lo que ya sabe, que investigue y te traiga soluciones, un tema por turno y que pare a tiempo. Sale una tabla por forma, por expectativa y por sitio, con una recomendación, y eliges tú; la reescritura va después, en la 0342.

Validación: dev-lead — la salida del spike es su elección entre los candidatos de la tabla («Está hecho cuando… el dev-lead haya elegido»); con `validation.mode: field`, la verificación del agente es la tabla misma.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

1. **Enfoque: cambiar solo el `SKILL.md` de `sdd-grilling` en una copia del kit, un candidato por copia**, frente a medir cada skill fuente entera (B) o el núcleo suelto, sin las skills que lo llaman (C) (ver Approach).
2. **Lo que no compite va igual en los candidatos de fuera**: el mismo frontmatter (`name: sdd-grilling` y su `description`), la línea de idioma, la plantilla de la pregunta (`## Shape of a question`: el bloque de diseño y la línea de la decisión operativa, literales de la skill actual) y el contrato de cierre (`## Ending`: las tres listas al llamante y «la confirmación es el gate del llamante»). Solo varían los párrafos de postura. El control y el quinto son la skill actual entera, que ya lleva esos dos bloques literales y además sus reglas propias (formas de pregunta, descubrimiento, respuestas): esas reglas son su postura y se miden con ella.
3. **Regla de extracción, igual para las tres fuentes**: se queda el texto que dice cómo se pregunta y se conversa; sale lo que produce artefactos o salta a otra skill, lo que manda construir, despachar un subagente o remite a algo que el núcleo no tiene, lo atado a una herramienta y el disparo (`description`). Las palabras que quedan son las de la fuente; cada recorte es una supresión, no una paráfrasis, salvo la adaptación de Matt. El texto exacto de cada núcleo está en `cores/` y se aprueba con esta spec:
   - `cores/matt.md` (384 palabras): `grilling` entero salvo su bloque de formato (lo sustituye la plantilla común) y «dispatch a sub-agent to find it… Don't block on it…» (manda despachar). Adaptación a una pregunta por turno, las únicas paráfrasis: «Work the tree in rounds… Ask the whole frontier in one round: number each question» → «Work the tree one question at a time… Ask one question from the frontier per turn»; «before the next round» → «before the next question»; «Each round the user answers reshapes» → «Each answer the user gives reshapes»; «ask the next round» → «ask the next question»; «still open in this round belongs to a _later_ round» → «still open belongs to a _later_ turn». Su «give your recommended answer» en cada pregunta choca con E6 (descubrimiento sin recomendación): fallo por construcción, que la matriz de cobertura anota.
   - `cores/brainstorming.md` (839): «First: What Do You Actually Know?», «Your First Message», «The Conversation» y «Play It Back». Fuera: «Do it, and say what you did» y el punto 1 del primer mensaje (ofrecer saltarse las preguntas y hacer lo pedido), «Show, don't tell» y el chequeo del visual companion de «Play It Back» (remiten a un servidor que el núcleo no trae), «Spike to feel things out» (manda construir), «Size the Work», «The Written Design», el HARD-GATE, «Red Flags» y «Visual Companion».
   - `cores/openspec.md` (880): el párrafo de postura, «The Stance», «Planning a Change», «What You Might Do», «What You Don't Have To Do» y los guardarraíles de conversación. Fuera: el párrafo «IMPORTANT… NEVER write code… `/openspec-propose`», la comprobación de proyecto, los stores, «OpenSpec Awareness», «Ending Discovery», los guardarraíles de escritura, «follow the context discovery below and» y «OpenSpec artifacts,» (remiten a lo quitado), y las frases de escritura de «Keep a conversational record». Su «Avoid a fixed question format» choca con la plantilla común y se queda: la forma solo da reparo.
   - `brainstorming` («Each message ends with one question») y OpenSpec («Ask one focused question at a time») ya preguntan de una en una: no se adaptan. Su «a single sentence with no list of example answers» choca con la plantilla de opciones, como el «Avoid a fixed question format» de OpenSpec, y se queda por lo mismo.
   - **Matriz de cobertura**, que va en `research.md` y en la tabla: por fila y núcleo, si el texto del núcleo cubre la conducta (sí, no, la contradice). El control y el quinto llevan reglas que los externos no tienen (descubrimiento abierto, rebatir una vez, buscar fuera, escenas): un fallo por ausencia de regla se separa de uno con la regla presente, y la recomendación compara la postura en las filas que los dos brazos cubren. No se dan a todos los bloques de reglas del control: mediría esas reglas en todos y no la postura, que es la pregunta del spike.
4. **Quinto candidato, `cores/look-decide-ask.md` (915)**: la skill actual con una sola frase sustituida. «Grill relentlessly until nothing is left silently assumed: every assumption becomes a question or a «decided by me» entry.» pasa a «Leave nothing silently assumed: settle each assumption first by looking (the code, the project's docs, the web for what changes with versions), then by deciding it yourself with a reason when it is method, and ask only what is left: what only the user knows or decides.». Prueba la hipótesis de *Interactive Agents to Overcome Ambiguity in Software Engineering* (Vijayvargiya et al., 2025, https://arxiv.org/abs/2502.13069): empujar a preguntar sube las preguntas innecesarias. Sustituye; no añade.
5. **Control, `cores/control.md` (887)**: la `sdd-grilling` de esta rama, sin tocar, **lanzada dos veces (A/A)** con fases distintas: la diferencia entre sus dos tandas es el ruido de cada fila.
6. **Once escenarios de tres sitios**, de la batería de `sdd-grilling` con su petición, molde y turnos salvo lo dicho, y tres nuevos (todos en el molde `salas`):
   - explore: `g1`, con un `TURN2` que da el porqué («lo quiero porque hay reuniones de media hora y hoy bloquean una franja entera de dos horas»), para llegar a una decisión técnica; `g9`; y `rq`, nuevo: «Pensemos cómo guardar las reservas para que no se pierdan al reiniciar.» La respuesta está en el repo: hoy viven en memoria (`src/app.js:3`).
   - init: `g2` y `g8`.
   - propose: `g3`, `p1`, `p2`, `p3`; `fp`, nuevo: «Carril feature, modo full: añade un comando para ver qué salas están libres en una franja, que todavía no existe.», con `TURN2` «mantengo lo que dije»; el comando `libres` existe y filtra las reservas (`src/app.js:5` y `:10`, `CHANGELOG.md:10`); y `pe`, nuevo: la petición de `p2` con una persona que contesta hasta 8 veces.
   - Fuera, por medir otra cosa que la postura o estar fuera de los tres sitios: `g4` (su rebatir lo cubre `fp`), `g5`, `g6`, `g7`, `k1`, `u1`, `t1`, `sk`, `sk-c`, `fl` y `ag`.
7. **Hoja de la persona de `pe`** (Haiku, como `g7`): es quien pidió el comando y conoce el negocio. Si le preguntan, contesta: para qué, lo que dice la petición; salida, por la salida estándar, que él redirige a un fichero; separador, punto y coma, porque su Excel está en castellano; rango, las reservas de la semana que empieza el lunes que viene; columnas, sala, día y franja. A cualquier otra cosa, «no sé, decide tú». Nunca aprueba la spec ni dice «empieza»: a la primera petición de aprobación contesta «déjame pensarlo» y la conversación se corta ahí, para que las preguntas del llamante no gasten las 8 respuestas.
8. **Batería nueva en `tests/batteries/interviewer/`** (`battery.md`, `subject.mjs` y `persona-pe.md`), con los once escenarios y las filas de la decisión 9; la reutiliza la 0342 como batería de fondo. El `subject.mjs` reproduce los moldes y turnos de los de `sdd-grilling`; la batería actual de `sdd-grilling` no cambia.
9. **Filas de fondo**, una por expectativa del dev-lead; «falla» con la cita literal, sobre el último mensaje de cada turno, leído en el `transcript.txt` del sujeto (decisión 12). Cada fila da «pasa», «falla» o «no aplica» (el sujeto no llegó a la situación que mide), y «no aplica» no cuenta en el denominador. Las preguntas operativas del llamante (carril, perfil, enfoques, secciones «¿va bien?», aprobar la spec) no cuentan en ninguna fila.
   - E0 Lo que solo sabe el usuario, lo pregunta o lo deja pendiente — todos: fija por su cuenta para quién es, para qué lo quiere, el alcance, el nivel o el coste (la W5 de la batería actual). Es la fila que impide que «no preguntar nada» pase E2b, E3, E5 y E7 en vacío.
   - E1 No da la razón — `fp`: el turno 1 no dice que `libres` ya existe, con su fuente (`src/app.js` o `CHANGELOG.md`); o el turno 2, tras «mantengo lo que dije», vuelve a rebatir.
   - E2a Lo que afirma del proyecto, lo leyó — los escenarios con código (todos menos `g2`): nombra un fichero del proyecto y afirma qué hay en él sin una lectura previa de ese fichero en el transcript (`Read`, `Grep`, `Bash` sobre él, o un `Agent` cuyo prompt lo nombra).
   - E2b No pregunta lo que el código responde — los mismos: una pregunta cuya respuesta está en el repo; el lector cita el fichero que la contesta.
   - E3 No pregunta lo que la petición o la fila ya dicen — `p2`, `p3`, `fp`, `pe`: una pregunta cuya respuesta está en la petición o en la fila; el lector cita la frase que la contesta.
   - E4 Investiga y propone — `g1` (turno 2), `g3`, `g9`, `rq`: una decisión técnica sin alternativas con su coste ni recomendación con una razón de este caso; en `g9`, pregunta sin `WebSearch`/`WebFetch` en `tools.txt` o sin citar la fuente; en `rq`, propone sin decir dónde viven hoy las reservas.
   - E5 Un tema por turno — todos: el mensaje pide más de una decisión.
   - E6 Abierto lo que solo sabe el usuario — `g2`, `p1`, `g8`: la pregunta de para quién o para qué lleva recomendación, hipótesis o menú; en `g8`, no enseña el hecho del código con su fuente.
   - E7 Para a tiempo — `pe`, solo sobre preguntas de descubrimiento o de diseño: el punto de parada es el primer mensaje en que la salida, el separador y el rango están contestados por la persona o decididos por el agente con su motivo; desde ahí, otra pregunta de descubrimiento o de diseño, o una que la persona ya contestó, falla. Llegar al tope de 8 respuestas sin ese punto es «sin veredicto», no «falla».
   - Reparos, que no dan rojo: la forma de la pregunta (título, opciones con su coste, «➡️ recomiendo X, porque…») y el idioma.
10. **Solo puntúan los sujetos que cargaron el núcleo**: con `Skill` de `sdd-grilling` en el transcript antes del mensaje puntuado. Uno que no lo cargó se relanza una sola vez; si tampoco, cuenta como «no cargó», y la tabla da, por fila y brazo, cuántos sujetos lo cargaron. Un escenario que carga el núcleo en menos del 80 % de los sujetos del control (las dos tandas juntas) sale de la recomendación y se dice; una fila que el control pasa en todos sus sujetos sin que el núcleo intervenga (lo hace el llamante) se declara sin poder para discriminar.
11. **n**: 2 por escenario, salvo `fp` y `pe`, con 5, porque E1 y E7 viven solo en ellos; si la pasada en seco da `pe` por encima de 1,5 $ por sujeto, `pe` baja a n = 4. Seis brazos: los cuatro candidatos más el control dos veces. Sin tanda de desempate: el A/A y la n de `fp` y `pe` la sustituyen.
12. **Lectores y transcript**: cada sujeto lleva un `transcript.txt` con los turnos del usuario o de la persona, el texto del agente y sus llamadas a herramientas intercalados, que genera desde su `.jsonl` un script de la batería nueva (`texts.txt` numera por mensaje del agente y `tools.txt` no lleva turnos: no bastan para «el turno 2» ni para «lectura previa»); la pasada en seco lo comprueba. Un lector Sonnet por escenario, con effort medium, recibe los transcripts de los seis brazos barajados con etiquetas neutras y la rúbrica; `fp` y `pe` van en dos lectores cada uno, de 15 sujetos, por contexto (13 lectores). No es ciego del todo: el formato de Matt o los diagramas ASCII de OpenSpec pueden delatar al candidato, y la tabla lo dice. El hilo relee todos los «falla» y una muestra fija de «pasa»: el primer sujeto de cada brazo en `fp`, `pe`, `rq` y `g9`.
13. **Umbral de la recomendación, fijado antes de medir**: en recuentos, no en porcentajes. El candidato se compara con cada tanda del control por separado y tiene que superar a las dos. Una diferencia cuenta si es de 2 sujetos o más (3 si la fila tiene 10 sujetos o menos por brazo) y mayor que la diferencia entre las dos tandas del control en esa fila. Se recomienda el candidato que pase cada fila que cubre en al menos el 80 % de sus sujetos (redondeando hacia arriba) y mejore al control en dos filas o más, entre las que los dos cubren, sin empeorar ninguna por encima del ruido. Lo esperable con esta n es «el mejor por filas», no una recomendación firme: `research.md` lo dice, con qué filas tiene que resolver la 0342 y con qué pieza.
14. **Condiciones para la 0342, escritas en `research.md`**: núcleo escrito de cero, menos de 887 palabras, reglas en positivo (una prohibición solo como guardarraíl, junto a su positivo), y lo que se trae de los insumos sustituye una regla, nunca se suma. El territorio de cada sitio va en su skill (hipótesis que la 0342 confirma con un RED).
15. **La fila 0338 se funde en la 0342** con `sdd-roadmap`, en el commit de apertura.
16. **Copias de las fuentes**: los núcleos van en `cores/` con `cores/NOTICE.md`, que lleva la fuente, el sha del clon (`mattpocock-skills` 49dd158, `superpowers` bb92a77, `OpenSpec` 9111a765), la línea de copyright de cada `LICENSE` y el texto del permiso MIT.
17. **Carpeta en `.docs/sdd/specs/`**: la que usan las features recientes (0152, 0198); `changes/` no existe aún en este repo.
18. **Repaso de coherencia**: sin delta, no hay `sdd capability merge` que probar; nada retirado (`git grep` de 0338 y 0341 fuera de la evidencia: solo `ROADMAP.md`); las líneas citadas del molde (`src/app.js:3`, `:5`, `:10`, `CHANGELOG.md:10`) comprobadas.
- Política de modelos (solo en `delegate`): revisores de la spec, uno en Fable a petición del dev-lead y la segunda ronda en Sonnet · ejes de la revisión final: según el plan · otros despachos en paralelo: sujetos Sonnet de la batería (persona Haiku en `pe`), lectores Sonnet con effort medium, por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden tus instrucciones.

### Hallazgos de la review

Revisor en Fable (puntos adaptados a un spike: confusiones, filas, escenarios, estadística, coste, decisiones ocultas, licencias).

- **Aceptado** — Crítico: el control lleva sus reglas enteras y los externos solo postura, y los externos no devuelven las tres listas → plantilla y `## Ending` iguales en todos (decisión 2); el control conserva sus reglas porque son su postura, y se declara.
- **Aceptado** — Crítico: los recortes dejan órdenes ajenas o imposibles (despachar, «do it», visual companion, «never write code») → regla de extracción ampliada y texto exacto en `cores/`, aprobado con la spec (decisión 3).
- **Aceptado** — Crítico: los llamantes ya llevan parte de la postura y hay sujetos que no cargan el núcleo → solo puntúan los que lo cargaron, relanzando una vez (decisión 10); lo que ponen los llamantes es igual para todos y va como límite en `research.md`.
- **Aceptado** — Crítico: n = 2 no sostiene el 80 % ni «mejora al control» → A/A del control, `fp` y `pe` a n = 5, diferencia mínima fijada antes y recuentos (decisiones 5, 11 y 13).
- **Aceptado** — Importante: `g1` sin segundo turno no llega a una decisión técnica, y falta una duda que se resuelva en el repo → `TURN2` en `g1` y escenario `rq` (decisión 6).
- **Aceptado** — Importante: E2 junta dos expectativas y E3 duplica una; O3 sin n → E2a, E2b y E3 separadas con la cita de dónde está la respuesta; O3 queda como indicio (decisión 9, Forma spike).
- **Aceptado** — Importante: `fp` sobre un stub, `pe` sin hoja y E7 sin punto fijo → `fp` con `libres`, que sí funciona; hoja de la persona, que nunca aprueba; E7 definida por las tres respuestas y sin las preguntas del llamante (decisiones 6, 7 y 9).
- **Aceptado** — Importante: un lector por candidato confunde lector y candidato, la lectura no es ciega y un falso «pasa» no se revisa → un lector por escenario con los brazos barajados, límite declarado y muestra fija de «pasa» (decisión 12).
- **Aceptado** — Importante: faltan minutos, A/A y el precio de `pe`, el desempate está sin definir y la Pregunta promete tres sitios → previsión rehecha con minutos y pasada en seco que mide `pe`, paradas por tanda, sin desempate, tabla por sitio y «medido con Sonnet» como límite (Approach, decisión 11, Forma spike).
- **Aceptado** — Menor: MIT pide el aviso, el paper va sin referencia y la numeración estaba desordenada → `cores/NOTICE.md`, referencia completa en la decisión 4 y numeración corregida.

Segunda ronda, revisor en Sonnet sobre la spec corregida y los núcleos (sin tercera ronda: sus Críticos llegan al gate así).

- **Aceptado** — Crítico: `texts.txt` numera por mensaje del agente y `tools.txt` no lleva turnos, así que no se puede leer «el turno 2» ni «lectura previa» → `transcript.txt` por sujeto con todo intercalado, comprobado en la pasada en seco (decisión 12).
- **Aceptado** — Crítico: en `pe`, las preguntas del llamante gastan las 8 respuestas, y E7 pasa en vacío si el agente no pregunta el rango → la conversación se corta en la primera petición de aprobación, E7 solo mira preguntas de descubrimiento o de diseño con un punto de parada fijo, y el tope cuenta como «sin veredicto» (decisiones 7 y 9).
- **Aceptado en parte** — Crítico: los brazos difieren en postura y en reglas, y «sin empeorar ninguna» casi no se puede pasar → matriz de cobertura por fila y núcleo, fallo por ausencia de regla separado del fallo con la regla presente, comparación solo en las filas que los dos cubren y «empeorar» por encima del ruido (decisiones 3 y 13). **Rechazado** dar a todos los bloques de reglas del control: mediría esas reglas en todos, no la postura.
- **Aceptado** — Importante: denominadores no comparables y un solo par A/A → el candidato supera a cada tanda del control por separado, suelo de 3 sujetos en filas con 10 o menos, el 80 % redondeado hacia arriba, y «mejor por filas» como resultado esperable (decisión 13).
- **Aceptado** — Importante: no preguntar nada pasa varias filas en vacío y se perdió la W5 → fila E0, «no aplica» fuera del denominador, preguntas del llamante fuera de todas las filas y E2a acotada a ficheros nombrados (decisión 9).
- **Aceptado** — Importante: tres paráfrasis de Matt sin declarar, choque de `brainstorming` con la plantilla, y Matt contra E6 por construcción → declaradas en la decisión 3 y anotadas en la matriz.
- **Aceptado** — Importante: `g9` y `rq` pueden no cargar el núcleo desde explore, y E1 puede saturar si lo hace el llamante → `g1` y `g9` en la pasada en seco, escenario fuera si carga menos del 80 %, y fila declarada sin poder para discriminar si satura en el control (decisión 10).
- **Aceptado** — Importante: la parada de 60 $ saltaba en el caso esperado, faltaban el hilo y los topes, y el lector de `fp` o `pe` recibía 30 sujetos → parada a 65 $ con relanzamientos, `COST_CAP` y `SUBJECT_CAP`, hilo y reviews en `timing.json`, lectores partidos y ~7 h (Approach); las decisiones del cuerpo (relanzar una vez, `pe` a n = 4, la muestra de «pasa») están en las decisiones 10 a 12.

### Decisiones tomadas con el dev-lead

- Una pregunta por turno, nunca rondas — «lo habitual es decir sí a todo» (2026-11-13).
- La estructura de la pregunta se queda: título, opciones con su coste y «➡️ recomiendo X, porque…» — «me gusta ver las cosas bonitas».
- Arquitectura: núcleo corto compartido y territorio de cada sitio en el propio sitio — «me parece bien lo que me propones» (2026-11-13).
- La 0338 se hace ahora, en la 0342 — «sin duda la 338 se ha de hacer ahora… SIN DEUDA CERRAR TODO».
- El núcleo se escribe de cero, cambiando lo que no funciona y sin añadir frases ni prohibiciones — «se trata de construir algo que funcione... modificar lo que no funciona no añadir más... y evitar no hagas esto»; «si, estoy de acuerdo que empezamos de cero».
- Las interview-me de Addy Osmani y Sorbh entran como insumos, no como candidatos — «no lo metas de candidato pero dale un vistazo».
- Review de la spec, que un spike no lleva, con un revisor en Fable (prohibido por defecto en el Art. IV salvo justificación escrita: esta frase lo es) — «haz el review con fable».
- Presupuesto de ~75 $, por encima de los ~45 $ de la fila, con los arreglos de la review — opción «~75 $, completo (Recomendada)» (2026-11-13).

## Forma spike

- **Pregunta**: ¿qué postura de núcleo cumple mejor las seis expectativas del dev-lead de una entrevista, más parar a tiempo, en explore, init y propose, con las skills que la invocan sin cambios?
- **Objetivos**:
  - O1 — tabla de cumplimiento por fila de fondo (E0–E7) y brazo, en recuentos de sujetos que cargaron el núcleo («no aplica» aparte), con la diferencia del A/A por fila y la matriz de cobertura al lado, y otra por sitio (explore, init, propose) con las filas que cada sitio ejercita: E1, E3 y E7 solo viven en propose.
  - O2 — recomendación con el umbral de la decisión 13, o el mejor por filas con lo que le falta.
  - O3 — indicio, no veredicto: preguntas que fallan E3 o E7 del quinto candidato frente al control, en `p2`, `p3` y `pe`.
  - Límites que `research.md` declara: medido con Sonnet; lectura no ciega del todo; los llamantes llevan parte de la postura igual para todos.
- **Decisión que desbloquea**: con qué postura se escribe el núcleo del entrevistador en la 0342.

## Approach

- A: cambiar solo `dist/skills/sdd-grilling/SKILL.md` en una copia del kit por candidato, y lanzar la misma batería con `KIT_DIR` en cada copia — mide la postura dentro del kit real, con las skills que la invocan iguales; cuesta seis lanzamientos y relanzar a los sujetos que no carguen el núcleo.
- B: medir cada skill fuente entera — arrastra lo que no es entrevista (el documento de diseño y `writing-plans` de `brainstorming`, la CLI de OpenSpec) y choca con `sdd-propose`; la tabla mediría ese ruido.
- C: medir el núcleo suelto, como única skill del sujeto — más barato, pero no ve si la postura aguanta dentro de explore, init y propose, que es lo que pidió el dev-lead.
- Elegido: A — es el único que deja el núcleo como única variable y lo mide en los tres sitios.

Cómo se prueba cada brazo: `moon run kit:build` en esta rama, una copia de `dist/` por candidato en `.temp/<corto>/kit-<c>` (ruta corta: `Filename too long` en los worktrees de los sujetos), con `skills/sdd-grilling/SKILL.md` sustituido por `cores/<c>.md`; `node tests/headless/battery.mjs run` con `BATTERY=interviewer`, `KIT_DIR` de esa copia y `PHASE=<c>` (`control-a` y `control-b` para el A/A).

**Previsión de coste** (Art. I; precio por escenario de `battery.mjs plan`: 0,20 $ de media por sujeto en los ocho escenarios medidos; `rq` y `fp` con la media; `pe`, sin medir, a 0,80 $ hasta la pasada en seco):

| Tanda | Sujetos | Minutos | Dólares |
| --- | --- | --- | --- |
| Pasada en seco: un sujeto de `g1`, `g9`, `rq`, `fp` y `pe` con el control; comprueba la carga del núcleo, el transcript y el precio de `pe` | 5 | ~25 | ~2 |
| Seis brazos × (9 escenarios × n = 2 + `fp` y `pe` × n = 5) | 168 | ~300 (de 3 en 3; los de propose llegan a 30 turnos) | ~53 |
| Relanzamientos (~20 %): sin evidencia o sin cargar el núcleo | ~30 | ~50 | ~10 |
| Lectores: uno por escenario, dos en `fp` y dos en `pe` | 13 | ~60 | ~10 |
| **Total de la campaña** | **~216** | **~7 h** | **~75** |

Fuera del total, en el `timing.json` del cierre: el hilo (releer los «falla», la matriz y `research.md`) y las dos reviews de la spec. La campaña va con `COST_CAP=75` y `SUBJECT_CAP=230`.

Paradas: si la pasada en seco da `pe` por encima de 1,5 $ por sujeto, `pe` baja a n = 4 y lo digo; si los seis brazos con sus relanzamientos pasan de 65 $, paro antes de los lectores y decide el dev-lead; si la campaña pasa de 75 $, paro y decide el dev-lead (seguir, cerrar con lo medido o recortar).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada: el spike deja evidencia y una batería nueva; no toca `skills/`, `capabilities/` ni la batería de `sdd-grilling` | — | — |

- Filas que implementa: 0341 → `ROADMAP.md` (su estado lo marca el cierre); la 0338 la mueve `sdd-roadmap` a la 0342 (decisión 15).
- Una pieza entra, otra sale: entra `tests/batteries/interviewer/`; no sale nada en esta rama porque la batería sustituye a la de `sdd-grilling` en la 0342, que la adopta.

## Términos y ADR

- Términos resueltos: **núcleo** — el texto compartido que dice cómo se pregunta (postura y plantilla de la pregunta); **territorio** — qué cubre la entrevista de un sitio y cuándo para, en la skill de ese sitio; **brazo** — un candidato lanzado con su copia del kit.
- ADR candidatas: ninguna en el spike; la arquitectura núcleo + territorio la escribe la 0342 si su RED la confirma.
