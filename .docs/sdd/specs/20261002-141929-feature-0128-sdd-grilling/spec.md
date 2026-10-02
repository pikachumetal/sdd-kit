---
id: 20261002-141929-feature-0128-sdd-grilling
feature: 0128
proposal: 0119
title: sdd-grilling, el método de preguntas del kit
mode: full
status: approved
created: 2026-10-02
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-02
---

# Spec — `sdd-grilling`, el método de preguntas del kit

## Capacidades

- Nuevas: `interviewing` — cómo pregunta el kit al usuario cuando una skill necesita sus decisiones: una por turno, forma de cada pregunta, recomendación, rechazo, «decide tú» y cuándo para.
- Modificadas: `configuration` — `sdd-config` pregunta con `sdd-grilling`.
- Modificadas: `onboarding` — la entrevista de las init pregunta con `sdd-grilling`.
- Modificadas: `feature-flow` — el diseño de una feature (`brainstorming`) pregunta con `sdd-grilling`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`interviewing`), MODIFIED (`configuration`, `onboarding`), tres capacidades, área no explorada (`sdd-roadmap`, `sdd-init-brownfield` y `sdd-consult` no se han leído enteras en esta sesión) · tamaño: ~300 líneas en ~16 ficheros
- Dominio: si los trece requisitos de `interviewing` contradicen lo que hoy prometen `configuration` («una sola pregunta cerrada por turno», con diálogo) y `onboarding` («cada turno termina con una única pregunta de la lista»), y si «el descubrimiento sin hechos queda pendiente» choca con el requisito de greenfield que ya escribe «pendiente» (señal: MODIFIED + capacidad nueva)
- Técnica: si la previsión de la campaña cubre cada paso cambiado en las 6 skills (sobre todo `sdd-init-brownfield`, sin escenario propio) y si el escenario de persona en bucle es implementable con `subject_resume` sin tocar `run.sh` (señal: área no explorada)
- Mínimo razonable: un revisor con los siete puntos — deja con una sola mirada el cruce entre capacidades, que es donde un MODIFIED sin declarar se esconde

1. **Capacidad nueva `interviewing`** (inglés kebab-case: es nombre de fichero). La regla de preguntas deja de estar repartida en `configuration`, `onboarding` y los textos de 6 skills y vive en un solo sitio.
2. **`sdd-grilling` se escribe en inglés** (frontmatter, cuerpo y `NOTICE`), con la línea «talk to the user in their language»: la recomendación oficial de Anthropic es decir el idioma de respuesta explícitamente ([Multilingual support](https://platform.claude.com/docs/en/build-with-claude/multilingual-support): castellano al 98,2 % del inglés). Los tests, la evidencia y los docs de `.docs/sdd/` siguen en castellano: los lee el equipo. **Enmienda del Art. III**, que sustituye a su segunda frase: «Las skills se escriben en inglés: es el idioma del ecosistema de skills y gasta menos tokens por instrucción, y cada skill le dice al agente que hable con el usuario en su idioma. Las que siguen en castellano se traducen al reescribirlas (0121); hasta entonces conviven. Se descarta la decisión del 2026-07-09 («no se traducen»): se tomó sin plantear el idioma al empezar, no midiéndolo (dev-lead, 2026-10-02)».
3. **Licencia**: `skills/sdd-grilling/NOTICE` (sin extensión: el nombre estándar, y fuera del recuento de `WordBudget`, que mide `*.md` que lee el agente) lleva el copyright y el texto íntegro de la MIT de `mattpocock/skills`; la skill lo cita. `THIRD_PARTY_NOTICES.md` en la raíz, una línea de índice. Motivo: `npx skills add … --skill sdd-grilling` instala solo la carpeta (`tech-stack.md`), y la MIT exige el aviso «in all copies or substantial portions»; un aviso solo en la raíz incumple en ese canal.
4. **Diseño del RED**: primer turno + `TURN2` genérico para casi todo, y un escenario con persona en bucle (Haiku con hoja de respuestas fija) solo para medir el final de la entrevista. El juez de las métricas de forma soy yo leyendo `texts.txt`, con rúbrica escrita en la batería: un juez LLM añade ruido a métricas que se leen en un minuto.
   - **Skill medida** (cuarto argumento de `subject_init`): la que llama, no `sdd-grilling`, que en el RED no existe. Por escenario: `sdd-consult`, `sdd-init-greenfield`, `sdd-start-feature`, `sdd-roadmap`, `sdd-config` y `sdd-init-brownfield`.
   - **Persona en bucle**: una función nueva en `tests/headless/lib.sh`, junto a `subject_resume` y sin tocar `run.sh`. Saca el último texto del sujeto (modo nuevo en `extract.mjs`), llama a `claude -p --model haiku` con la hoja de respuestas del escenario y reanuda la sesión con su respuesta. Para cuando el último mensaje del sujeto no termina en pregunta, o al llegar a 8 turnos. El coste de Haiku se suma al `RESULTADO` del sujeto, para que el techo de `run.sh` lo cuente. Lleva su test con `DRY_RUN`.
   - **La `description` de `sdd-grilling`** la acota a «invocada por otra skill del kit», sin resumir su proceso (`writing-skills`). Lleva un control de enrutado en el GREEN (`u1`): una petición de pensar algo entra por `sdd-consult`, no por `sdd-grilling`.
   - **Requisito → escenario** (Art. I):

     | Requisito | Escenario | Turno | Fila de la rúbrica |
     | --- | --- | --- | --- |
     | Una decisión por turno | g1, g2, g3, g4, g8 | 1 | decisiones en el último mensaje |
     | Diseño en texto, operativa con diálogo | todos (la decisión de diseño) | 1 | ❓, iconos, la recomendada primera, ➡️; la operativa no se mide: en headless no hay `AskUserQuestion` |
     | Alternativas reales | g1, g3, g4 + micro-test | 1 | alternativas que nadie defendería |
     | La recomendada se gana con razón | g1, g3, g4, g7 | 1 | razón con un hecho, un coste o una evidencia del caso, y su coste |
     | El descubrimiento no se ancla | g2 (sin código), g8 (con código) + micro-test | 1 | recomendación o hipótesis en una pregunta de descubrimiento; hecho con su fuente |
     | Escena concreta | g3 | 1 | escena con datos y efecto, no causa |
     | Rebatir una vez | g4: la petición choca con un hecho del molde | 1 y 2 (`TURN2` «mantengo lo que dije») | rebate con argumento y alternativa; en el 2, acepta sin volver a rebatir |
     | «Decide tú» | g5 = g2 + `TURN2` «decide tú lo que puedas» | 2 | método decidido y anotado; descubrimiento «pendiente» |
     | Tras un rechazo, en texto | g6 = g3 + `TURN2` «no, espera, explícamelo mejor» | 2 | explica en prosa sin volver a presentar la misma decisión con el formato fijo |
     | Cuándo para | g7 (persona en bucle, `sdd-config` con 3 claves que faltan) | último | para con la frontera vacía; devuelve las dos listas y lo pendiente |
     | Busca fuera del repo | g9: consulta de diseño cuya decisión depende de cómo se comporta una librería del molde en su versión actual, con `EXTRA_ALLOWED` para `WebSearch` y `WebFetch` | 1 | busca antes de preguntar; la pregunta cita la fuente |
     | Habla en el idioma del usuario | todos | todos | todo `texts.txt` en castellano |
     | `feature-flow`: el diseño pregunta con `sdd-grilling` | g3, g5, g6 | 1 | las filas de forma de arriba, dentro de `brainstorming` |
     | `configuration` MODIFIED | g7 | todos | una clave por turno con la recomendada del catálogo |
     | `onboarding` MODIFIED | g2, g8 | 1 | una pregunta de la lista por turno |

     No se miden, y por qué: «con cinco alternativas, las cinco» y «empate, depende de X» (solo aparecen en casos que el molde no fuerza; el micro-test de alternativas reales cubre el sesgo a tres); «rondas si el usuario las pide en la sesión» (sigue una petición literal); «sin usuario no pregunta» (lo miden ya los requisitos «sin usuario» de `configuration` y `onboarding`, que no cambian).
5. **Micro-tests de redacción** (exigidos por `superpowers:writing-skills` para guía que da forma a la conducta): las dos frases de más riesgo —«alternativas reales, sin paja» y «descubrimiento sin hechos: abierta, sin recomendación»— con 5 repeticiones por variante y un control sin guía, antes del GREEN.
6. **Previsión de la campaña** (Art. I, cubre RED, micro-tests y GREEN):
   - RED: g1–g6 y g9 × n=2 en Sonnet (14 sujetos, ~1 $ cada uno) + g8 brownfield × n=1 + g7 persona en bucle × n=2 (hasta 8 turnos de Sonnet y 8 llamadas a Haiku, ~3 $ cada uno) = 17 sujetos, ~21 $, ~1 h.
   - Micro-tests: 2 frases × 2 variantes × 5 = 20 llamadas de un turno, ~2 $, ~20 min.
   - GREEN: los mismos 17 + 4 de control (filas que el RED cumpla en los pasos que se tocan: tabla de claves antes de la primera pregunta en `sdd-config`, ramas y worktrees en turnos distintos en greenfield, la entrevista de `sdd-roadmap` no acaba en spec, `sdd-consult` no interroga una pregunta puntual) + `u1` de enrutado = 22 sujetos, ~25 $, ~1,5 h.
   - **Total ~59 ejecuciones, ~48 $, ~3,5 h. Techo: 70 ejecuciones y 60 $**, una tanda de REFACTOR incluida. Si se supera, paro y decides tú.
   - Pasos cambiados y su escenario: `sdd-consult` paso de pensar/estructurar → g1; `sdd-init-greenfield` entrevista → g2, g5; `sdd-start-feature` paso 4 y `overrides-superpowers.md` → g3, g5, g6; `sdd-roadmap` entrevista → g4; `sdd-config` paso 2 → g7; `sdd-init-brownfield` paso 3 → g8, en un molde con código y sin `.docs/sdd/` (el descubrimiento con hecho y su fuente). Sin cambio, comprobado: `sdd-init-brownfield/references/generacion.md`, `sdd-init-greenfield/references/estructura.md` y `migrations/` no llevan regla de preguntas; `using-sdd` no lista skills por nombre en una tabla que cambie, y su control es `u1`.
7. **Una pieza entra, otra sale** (Art. I). Entra `sdd-grilling` (~500 palabras). Sale la regla de preguntas repetida en `sdd-consult`, `sdd-roadmap`, `sdd-init-greenfield`, `sdd-init-brownfield`, `sdd-config` y `sdd-start-feature` (paso 4), sustituida por una línea que invoca `sdd-grilling`; sale la dependencia opcional de `grilling` de Matt del README y de `tech-stack.md`; salen las dos filas de deuda que absorbe (decisión de producto sin escena concreta; reapertura del diálogo tras un rechazo).
8. **Topes de palabras**: `sdd-grilling` con `SkillMd = 600; Total = 600`, y el kit de 53.880 a 54.480 (medido hoy: 53.875). Los topes de las 6 skills no suben: la línea de invocación sustituye a la regla; si alguna pasa de su tope, se recorta dentro de la propia línea.
9. **Formato de la pregunta** (adaptado del de Matt para una sola): ❓ título y cuerpo; cada alternativa con su icono (🅰️ 🅱️ con dos; 1️⃣ 2️⃣ 3️⃣… con tres o más; 🔀 para la mezcla), la recomendada primero; ➡️ la recomendada con su razón. «Primero» mantiene vigentes los requisitos de `configuration` que dicen «la recomendada primero» (la pregunta de quién valida, entre otros) sin otro MODIFIED; repaso de coherencia: la primera redacción la ponía solo al final, y contradecía esos requisitos. Los iconos solo marcan las opciones de la pregunta en curso; para nombrar algo de fuera se usa su nombre.
10. **Lo que no se toca por la congelación de la 0121**: en las 6 skills, solo la regla de preguntas. Las aprobaciones con `AskUserQuestion` de esas skills (gates de spec, plan, validación) siguen igual.
11. **La devolución no cambia ninguna plantilla**: `sdd-grilling` devuelve las dos listas y lo pendiente en su texto, y cada llamante lo pone donde ya lo pone hoy. En `sdd-start-feature`, «Decisiones que he tomado yo» y «Decisiones tomadas con el dev-lead» de la spec. En las init, la entrada del documento o «pendiente». En `sdd-roadmap`, la propuesta. En `sdd-config`, las respuestas que devuelve o escribe. En `sdd-consult`, la respuesta.
12. **«Decide tú» y `delegate` no son dos reglas para lo mismo.** Las paradas las fija `control-profiles.md`, y `sdd-grilling` no las cambia. «Lo que es del usuario» (alcance, nivel, dinero) lo cita de allí, sin redefinirlo (Art. IX).
13. **Las claves del catálogo de `sdd-config` son decisiones de método**: la recomendada y su motivo los pone el catálogo, que es la razón del caso. La clave que el catálogo dice que va sin recomendada (push con una convención distinta de git-flow) es el «empate» de `interviewing`, no una excepción.
14. **«Decide tú» en `sdd-config`** escribe la recomendada del catálogo y la apunta en «decidido por mí»: el usuario delegó la respuesta, así que contestar «decide tú» es responder, no callar. «No sé» sigue sin escribir nada.

### Hallazgos de la review

Dos revisores (Sonnet, `sdd-kit:effort-medium`), dominio y técnica.

- **Aceptado** — D1, D2, T7: las claves del catálogo y la de ramas parecían chocar con «sin razón, empate» → decisión 13 y el THEN del MODIFIED de `configuration` con «salvo la clave que el catálogo deja sin recomendada»; la de ramas ya trae razón (git-flow), sin MODIFIED.
- **Aceptado** — D3: `mission.md` dice «cada pregunta va con `AskUserQuestion`» y cuenta «12 skills de proceso» → `mission.md` entra en el Scope.
- **Aceptado** — D4: el override en `brainstorming` no tenía requisito → ADDED en `feature-flow`.
- **Aceptado** — D5: «decide tú» en `sdd-config` → decisión 14 y un AND en el MODIFIED de `configuration`.
- **Aceptado** — D6, T6: faltaba qué hace sin usuario → ADDED «Sin usuario, no pregunta», sin escenario propio (motivo en la decisión 4).
- **Aceptado** — D7: faltaban las «Reglas de la capacidad» de `interviewing` → añadidas.
- **Aceptado** — D8: la enmienda del Art. III sin redactar → texto en la decisión 2.
- **Aceptado** — D9: los iconos se agotan con más de dos → 1️⃣ 2️⃣ 3️⃣ con tres o más (decisión 9).
- **Rechazado** — D10 (ejemplos): `roles.ts`, `clinic_admin` y «Informe Q3» son inventados y no nombran a nadie. El recuento de `mission.md` queda en D3.
- **Aceptado** — T1: faltaba qué escenario mide cada requisito → tabla en la decisión 4. Lo que no se mide, con su motivo. «Rebatir» y el rechazo se provocan en el primer mensaje o con un `TURN2` que vale para cualquier pregunta.
- **Aceptado** — T2: el bucle no cabía en `lib.sh` tal cual → función nueva, modo nuevo de `extract.mjs`, parada, tope de 8 turnos y coste de Haiku en el techo (decisión 4); la previsión sube (decisión 6).
- **Aceptado** — T3: brownfield sin escenario → g8 con molde con código.
- **Aceptado** — T4: faltaban ficheros que el agente sigue → comprobados sin regla de preguntas (decisión 6), y control de enrutado `u1`.
- **Aceptado** — T5: el formato de la devolución y su relación con `delegate` → decisiones 11 y 12.
- **Aceptado** — T8: el idioma sin medir → fila de la rúbrica sobre todo `texts.txt`.
- **Aceptado** — T9: decisiones que estaban en el cuerpo → `description` y skill medida en la decisión 4.
- **Aceptado** — T10: `subject_init` muere sin la skill medida → la skill medida es la que llama (decisión 4).

### Decisiones tomadas con el dev-lead

Todas del brainstorm del 2026-10-01 y 2026-10-02. Las que cambian la fila 0128 o la propuesta 0119 se marcan «**cambia la fila**».

- **Una decisión por turno**; las rondas de hasta 4 preguntas de la fila quedan descartadas (**cambia la fila**, punto 3) — «Me agobia recibir muchas preguntas de golpe» · «se pierde el hilo de la 4 y la 5 que no le has contestado… cuando llevas varias le vas a decir todo ok! por cansancio» (2026-10-01). Apoyo: la literatura de encuestas (más *straightlining* en bloques que en preguntas sueltas, Krosnick) y el propio Matt («Asking multiple questions at once is bewildering», su versión hasta el 2026-07-16; issues #663, #895 y #997 de `mattpocock/skills`).
- **Rondas configurables en `sdd-kit.local.json`: después, no ahora** — «ok me parece bien lo de la clave luego» (2026-10-01). Si el usuario pide rondas en la sesión, la skill obedece esa sesión.
- **De `grilling` se queda**: el árbol de decisiones y la frontera para elegir la siguiente pregunta (primero la que cambia el árbol), los hechos los busca el agente y las decisiones son del usuario, y el formato de iconos; **sale** la ronda emitida (la separación de chrislacey89/skills #173).
- **Recomendación**: decisión de método, técnica o alcance → la recomendada; descubrimiento con un hecho encontrado → el hecho con su fuente; descubrimiento sin hechos → abierta, sin recomendación ni hipótesis — «Sí, la síntesis» (2026-10-01).
- **Abogado del diablo**: cada recomendación dice su coste; si una respuesta choca con un hecho o hay algo mejor, se rebate una vez con argumento y alternativa — «Coste en la recomendada + rebatir una vez» (2026-10-01).
- **Alternativas reales, tantas como haya, mezclas incluidas, sin paja; la recomendada se gana con una razón del caso; sin razón, «empate, depende de X»; incisivo también con la premisa** — «me gustan mucho la verdad» (2026-10-01).
- **Escena concreta** en las decisiones de producto y **enseñar en vez de preguntar** lo que no se resuelve hablando (**cambia la fila**: la escena ya estaba; enseñar es nuevo) — «Sí, las dos» (2026-10-01).
- **Parar**: frontera vacía; la confirmación es el gate del llamante, o una pregunta en `sdd-consult`; devolución con dos listas — «Sí, confirmación en el gate del llamante» (2026-10-01).
- **«Decide tú»** por pregunta o para toda la entrevista; el descubrimiento sin hechos queda pendiente — «Sí, tal cual» (2026-10-01).
- **Rechazo del diálogo**: esa decisión sigue en texto hasta cerrarla; la siguiente vuelve al formato normal — «A» (2026-10-02).
- **La entrevista va en texto, no con `AskUserQuestion`** (**cambia la fila**: «como mucho 4 preguntas por llamada a `AskUserQuestion`» sale) — «como me has preguntado la última es mucho mejor… dos opciones con texto largo y una recomendación clara y con datos… y si tienes que poner una, dos, 3… 5 opciones no tiene la limitación de AskUser» (2026-10-02).
- **El diálogo se queda para las decisiones operativas** (opciones que se entienden en una línea: aprobar, seguir, confirmar), y el diseño va en texto — «presentar unas opciones que ninguna es como la buena... que son decisiones de funcionamiento está bien... es saber usarlo en el momento correcto» (2026-10-02). El predicado observable: si alguna alternativa necesita más de una línea para entender su consecuencia, va en texto.
- **Medir las pestañas de `AskUserQuestion` con datos**, como pedía el arranque: se sustituye por la decisión anterior, tomada con el dato de esta sesión (las preguntas en texto con formato le resultaron mejores).
- **El RED: primer turno + `TURN2` y un escenario de persona en bucle** — «Vale… A+B tiene sentido» y la recomendación de la mezcla aceptada (2026-10-02).
- **Licencia: el aviso dentro de la skill** — «a ver, lo legal» (2026-10-02).
- **En `sdd-start-feature`, override de una línea**: `brainstorming` lleva el flujo y las preguntas siguen `sdd-grilling` — «A me suena muy bien… mientras el flujo lo controle brainstorm» (2026-10-02).
- **Presupuesto de palabras: sube sin compensación obligada** — «qué ganamos con adelgazar» y la conclusión aceptada (2026-10-02).
- **Buscar fuera del repo (MCP de documentación o internet) antes de preguntar lo que depende de un hecho externo, sin que el usuario lo pida** (**cambia la fila**: Matt solo dice «the environment») — «el tema de saber qué momento ir a internet a recabar datos... esta última parte siempre te la tengo que pedir, o inet o un mcp de documentación según tarea» (2026-10-02). En esta sesión lo pidió dos veces: leer el repo de Matt y buscar las recomendaciones sobre el idioma.
- **`sdd-grilling` es la primera skill en inglés; enmienda del Art. III** — «vamos a reescribir TODO así que es el momento de plantearnos el idioma. y esta sería la primera skill en inglés» (2026-10-02). Sin métrica aparte de fuga de idioma — «no me he visto nunca que me conteste en inglés».

## Intent

Hoy cada skill que entrevista al usuario repite su propia regla de preguntas («una pregunta por turno», «una pregunta cerrada por turno») y `sdd-consult` y `sdd-init-greenfield` mandan usar `grilling`, de un plugin que el kit no declara y que cambió a rondas sin que el kit lo supiera. Dos filas de deuda dicen que la forma de la pregunta falla (decisiones de producto sin escena; el diálogo reabierto tras un rechazo), y el dev-lead se agobia con las rondas. Se quiere un método de preguntas propio, en un solo sitio, que pregunte de una en una, recomiende con razones, rebata cuando toca y no ancle al usuario en lo que solo él sabe.

## Scope

- Entra: `skills/sdd-grilling/SKILL.md` (inglés) y `skills/sdd-grilling/NOTICE`; `THIRD_PARTY_NOTICES.md` en la raíz.
- Entra: en `sdd-consult`, `sdd-roadmap`, `sdd-init-greenfield`, `sdd-init-brownfield`, `sdd-config` y `sdd-start-feature` (paso 4), la regla de preguntas sustituida por la invocación de `sdd-grilling`; `sdd-start-feature/references/overrides-superpowers.md`, una fila: durante `brainstorming`, las preguntas siguen `sdd-grilling`.
- Entra: batería `tests/batteries/sdd-grilling/` (escenarios, rúbrica y procedencia), el script de persona en bucle sobre `tests/headless/lib.sh` con su test, y la evidencia `tests/sdd-grilling-red.md` y `tests/sdd-grilling-green.md`.
- Entra: `tests/WordBudget.Tests.ps1` (tope de la skill y del kit).
- Entra: `.docs/sdd/mission.md` («Flujo por defecto»: la entrevista ya no va con `AskUserQuestion`; «Es»: el recuento de skills).
- Entra: `.docs/sdd/constitution.md` Art. III (enmienda), `.docs/sdd/tech-stack.md` (dependencia de `grilling` fuera; la skill nueva), `.docs/sdd/architecture.md` (15 skills), `README.md` (fila de `grilling` fuera; la skill nueva), `CLAUDE.md` del repo («las 14 skills» → 15), roadmap (dos filas de deuda absorbidas; dos filas de backlog nuevas).
- No entra: la clave de rondas en `sdd-kit.local.json` → fila de backlog «si un compañero la pide», con la nota de `mattpocock/skills` #997: la skill lee la clave ella misma.
- No entra: el idioma de la documentación configurable en `sdd-kit.json` → fila de backlog (plantillas, `Test-Roadmap.ps1` y encabezados que comprueban los tests están en castellano).
- No entra: traducir al inglés las demás skills (0121); las aprobaciones con `AskUserQuestion` de las skills que llaman; la «una sola pregunta» de `using-sdd` (regla de duda del enrutado, no una entrevista) ni las paradas de una pregunta de `control-profiles.md`; la fila de deuda «el diálogo de `AskUserQuestion` tapa el guion de pruebas» (gate de cierre, congelado).

## Approach

Se adopta `grilling` de Matt como base y se cambia lo que el brainstorm decidió: la frontera sigue eligiendo qué preguntar, pero se emite una sola decisión por turno, en texto, con formato de iconos; la recomendación se reserva para decisiones y se gana con una razón del caso; el descubrimiento no se ancla. `sdd-grilling` es sub-skill (la invocan seis skills en un paso fijo, criterio de la propuesta 0119) con una `description` que la acota a «invocada por otra skill», para no competir en el enrutado. En `sdd-start-feature` no sustituye a `brainstorming`: lo viste (Art. IX), que lleva el flujo, y `sdd-grilling` pone la forma de cada pregunta. El RED mide el kit actual sin la skill; el GREEN, el kit con ella y las 6 llamadas cambiadas.

## Delta de comportamiento

### Capacidad: `interviewing`

**ADDED — Una decisión por turno**
- GIVEN una entrevista de `sdd-grilling` con tres decisiones abiertas sin dependencia entre ellas (nombre del comando, formato de salida, si admite filtro)
- WHEN el agente pregunta
- THEN el turno termina con una sola decisión, la que más cambia el resto (la que reabre otras ramas va primero)
- AND si el usuario pide en la sesión «pregúntamelo todo de golpe», en esa sesión pregunta por rondas

**ADDED — Una decisión de diseño va en texto con formato fijo; una operativa, con diálogo**
- GIVEN una decisión cuyas alternativas solo se entienden con su consecuencia explicada (más de una línea por alternativa: un coste, una escena, un argumento), como el diseño del RED con o sin persona en bucle
- WHEN el agente la pregunta
- THEN la escribe en texto, no con `AskUserQuestion`: ❓ título y cuerpo, cada alternativa con su icono (🅰️, 🅱️, 🔀 para una mezcla), la recomendada como primera alternativa, y ➡️ la recomendada con su razón
- AND los iconos solo marcan alternativas de esa pregunta: para referirse a una de una pregunta anterior usa su nombre («primer turno»), no su icono
- AND una decisión operativa, cuyas alternativas se entienden en una línea sin explicar nada (aprobar o pedir cambios, seguir o parar, confirmar carril y perfil), va con `AskUserQuestion`, la recomendada primero
- AND unas etiquetas cortas no hacen operativa una decisión de diseño: «¿🅰️ o 🅱️?» con costes distintos detrás va en texto

**ADDED — Alternativas reales, mezclas incluidas**
- GIVEN una decisión con dos alternativas defendibles y una tercera que nadie elegiría («ni clave ni salida en sesión»)
- WHEN el agente la pregunta
- THEN ofrece solo las dos defendibles, y la mezcla de ambas si combinarlas es defendible
- AND con cinco alternativas defendibles ofrece las cinco: no hay número fijo

**ADDED — La recomendada se gana con una razón del caso**
- GIVEN una decisión de método, técnica o alcance
- WHEN el agente recomienda
- THEN la razón cita un hecho, un coste o una evidencia de este caso, y dice lo que cuesta la recomendada («a cambio, …»)
- AND «es lo habitual», «es lo estándar» o «es más simple» sin decir qué ahorra no son razón
- AND sin razón para preferir, no marca recomendada: dice «empate, depende de X» y pregunta X

**ADDED — El descubrimiento no se ancla**
- GIVEN una pregunta sobre lo que solo sabe el usuario («¿quién usa el producto?») en un proyecto sin código
- WHEN el agente la pregunta
- THEN la hace abierta, sin recomendación ni hipótesis
- AND en un proyecto con código donde encontró `roles.ts` con `clinic_admin` y `patient`, enseña ese hecho con su fuente y pide confirmarlo, sin recomendar

**ADDED — Escena concreta en las decisiones de producto**
- GIVEN una decisión sobre lo que ve o hace quien usa el producto (pegar un vínculo cuando el plugin no ve el portapapeles)
- WHEN el agente la pregunta
- THEN cada alternativa lleva una escena con datos y lo que se ve en cada paso («pegas `https://…/doc/42` → sale la tarjeta "Informe Q3"»), y la limitación técnica se cuenta por su efecto, no por su causa
- AND si la decisión es cómo se ve o cómo se siente una pantalla, deja de preguntar y propone enseñar un boceto o un prototipo desechable

**ADDED — Rebatir una vez**
- GIVEN una respuesta del usuario que choca con un hecho del proyecto, o una premisa floja en lo que pide
- WHEN el agente la recibe
- THEN la rebate una vez, con el argumento y la alternativa concreta
- AND si el usuario mantiene su respuesta, la acepta y sigue, sin volver a rebatirla

**ADDED — «Decide tú»**
- GIVEN una entrevista con una decisión de método abierta y una de descubrimiento sin hechos pendiente
- WHEN el usuario contesta «decide tú» a toda la entrevista
- THEN el agente decide la de método sin preguntar y la anota en «decidido por mí» con su motivo
- AND sigue preguntando solo lo que es del usuario (alcance, nivel, dinero), explicando los términos
- AND la de descubrimiento queda «pendiente», no decidida: «seguro que son los administrativos» no es una decisión delegada
- AND con «decide tú» a una sola pregunta, decide esa y sigue preguntando las demás

**ADDED — Tras un rechazo, esa decisión sigue en texto**
- GIVEN una decisión que el usuario rechaza para aclarar («no, espera, explícamelo mejor»)
- WHEN el agente sigue
- THEN la conversación de esa decisión sigue en prosa hasta que el usuario la cierra, y su respuesta en texto la cierra sin volver a presentarla con el formato fijo
- AND la decisión siguiente vuelve al formato fijo

**ADDED — Cuándo para la entrevista**
- GIVEN una entrevista en la que no queda ninguna decisión por preguntar
- WHEN el agente termina
- THEN devuelve a la skill que la invocó dos listas: lo que decidió el usuario y lo que decidió el agente (con su motivo), más lo pendiente
- AND si la skill que invoca tiene gate (spec, documento de la init, propuesta), la confirmación es ese gate: no pide una confirmación propia antes
- AND invocada desde `sdd-consult`, que no tiene gate, confirma con una sola pregunta
- AND no pregunta lo que la petición ya dice o delega, ni lo que puede averiguar leyendo el proyecto

**ADDED — Busca fuera del repo antes de preguntar lo que depende de un hecho externo**
- GIVEN una decisión que depende de un hecho que el repo no tiene y que cambia con el tiempo: cómo se comporta una librería o herramienta en su versión actual, qué recomienda su documentación oficial, qué hace otro proyecto con el mismo problema o qué exige una licencia
- WHEN el agente va a preguntarla
- THEN antes lo busca, sin que el usuario se lo pida: primero en el repo; después en el MCP de documentación que tenga la sesión para esa tecnología (Context7, Microsoft Learn…), respetando los límites de llamadas que fijen las instrucciones del usuario; si no hay, en internet
- AND la pregunta cita lo que encontró con su fuente (enlace o fichero), y solo las decisiones que dependen de esa búsqueda esperan: el resto se pregunta mientras
- AND «lo sé de memoria» no vale para lo que cambia con las versiones o con el tiempo; sí para lo estable (qué es una licencia MIT, cómo funciona git)

**ADDED — Habla en el idioma del usuario**
- GIVEN un usuario que escribe en castellano y la skill escrita en inglés
- WHEN el agente pregunta
- THEN pregunta en castellano

**ADDED — Sin usuario, no pregunta**
- GIVEN una entrevista sin usuario presente (perfil `unattended`, o la skill que invoca dice que no hay nadie)
- WHEN `sdd-grilling` llega a una decisión
- THEN no la pregunta: decide las de método con su motivo, deja las demás como pendientes y devuelve las dos listas y lo pendiente a quien la invocó
- AND las paradas de cada perfil siguen siendo las de `control-profiles`: `sdd-grilling` no añade ni quita ninguna

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica; `sdd-grilling` no escribe ficheros, y lo que devuelve lo escribe quien la invoca, en sus documentos de siempre.
- **Idioma de los nombres**: el texto que ve el usuario (preguntas, listas «decidido por ti», «decidido por mí», «pendiente») va en su idioma; la skill, en inglés.
- **Límites**: una decisión por turno; sin tope de preguntas por entrevista (para con la frontera vacía); rebatir, una vez por respuesta.
- **Avisos**: no aplica.
- **Regla ante conflicto**: si el usuario pide rondas en la sesión, gana su petición en esa sesión; las paradas de `control-profiles` mandan sobre la entrevista.

### Capacidad: `configuration`

**MODIFIED — `sdd-config` pregunta una clave por turno, con la recomendada primero** (antes: «hace una sola pregunta cerrada por turno»)
- GIVEN claves que faltan en `sdd-kit.json` (p. ej. `execution` y `merge.push` en un proyecto de antes de la 0055) o una clave que el usuario quiere cambiar
- WHEN `sdd-config` pregunta
- THEN pregunta con `sdd-grilling` ([`interviewing`](interviewing.md)): una clave por turno, con la opción recomendada primero y su motivo, sacados de su catálogo, salvo la clave que el catálogo deja sin recomendada
- AND no vuelve a preguntar una clave que ya tiene valor, salvo que el usuario pida cambiarla
- AND con «decide tú», escribe la recomendada del catálogo y la apunta en «decidido por mí»; con «no sé» no escribe la clave y rige su default

### Capacidad: `feature-flow`

**ADDED — El diseño de una feature pregunta con `sdd-grilling`**
- GIVEN el paso de spec de `sdd-start-feature`, con `brainstorming` llevando el diseño de una feature que cambia lo que ve el usuario
- WHEN `brainstorming` necesita una decisión del usuario
- THEN la pregunta sigue `sdd-grilling` ([`interviewing`](interviewing.md)): una por turno, en texto con el formato fijo, con escena concreta si es de producto
- AND el flujo (enfoques, diseño por secciones, spec) sigue siendo el de `brainstorming`

### Capacidad: `onboarding`

**MODIFIED — La entrevista hace una sola pregunta por turno** (antes: sin método nombrado)
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN el agente pregunta al usuario o le presenta un documento
- THEN pregunta con `sdd-grilling` ([`interviewing`](interviewing.md)): cada turno termina con una única pregunta de la lista de la entrevista, o con un único documento para aprobar
- AND convención de ramas, worktrees y entorno del worktree son preguntas distintas, en turnos distintos

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-02 | aprobada: «Apruebo» |
