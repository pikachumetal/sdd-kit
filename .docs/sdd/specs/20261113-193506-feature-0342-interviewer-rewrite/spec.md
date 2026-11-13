---
id: 20261113-193506-feature-0342-interviewer-rewrite
feature: 0342
title: Reescribir el entrevistador del kit — núcleo propio de cero y el territorio en cada skill que pregunta
mode: full
status: approved
created: 2026-11-13
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-13
---

# Spec — Reescribir el entrevistador del kit

🦆 Cuando el kit te entrevista (al pensar algo en `sdd-explore`, al preparar un proyecto en `sdd-init` o al especificar en `sdd-propose`), hoy a veces da por hecho lo que no le has dicho: «lo tomo como confirmado y lo uso como base». Tampoco busca en la web antes de preguntarte, y vuelve a discutirte lo que ya mantuviste. Con esta feature, lo que decide él va marcado como suyo y lo que no contestaste queda pendiente. Si la decisión depende de la web, lanza la búsqueda antes de su primera pregunta. Y si insistes en «mantengo lo que dije», lo apunta como decisión tuya y sigue. Por dentro, `sdd-grilling` se reescribe de cero y dice solo cómo se pregunta; qué cubre cada entrevista y cuándo para pasa a la skill que pregunta, y la batería del entrevistador lo mide antes y después.

Validación: agente — `validation.mode: field` del repo: la medida es la batería del entrevistador y la de forma; el uso real llega por los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `interviewing` — la postura (mirar, decidir el método que zanja un hecho del caso, preguntar lo que queda), la alternativa única de método, lo que decide el agente va como suyo, nunca por rondas, rebatir una vez y apuntar la insistencia, la búsqueda web antes de la primera pregunta, la pregunta abierta de una frase y cuándo para cada entrevista.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (seis requisitos de `interviewing`, uno ADDED y tres reglas de la capacidad) · tamaño: ~275 líneas en 17 ficheros
- Dominio (sonnet): si los MODIFIED de «Una decisión por turno» y «Cuándo para la entrevista» conservan cada línea viva que la feature no retira, y si las paradas por skill de «Cuándo para» casan con lo que hoy dicen `sdd-init` paso 3, `sdd-config` paso 2 y `proposal.md` (señal: MODIFIED)
- Técnica (sonnet): si la regex de la fila K casa con las tres formas de lectura entera y rechaza `| head`, `Read` con `limit` y la mención de `sdd-grilling` en otro fichero; y si la previsión de coste y los topes de palabras salen de los comandos que citan (señal: MODIFIED + herramientas de la batería)
- Mínimo razonable: un revisor con los siete puntos — deja sin la segunda lectura la regex de la K y los topes
```

1. **Enfoque: B (núcleo sin territorio y territorio medido en cada llamante), frente a A y C** (ver Approach).
2. **La n de la batería del entrevistador**: `g9`, `g8`, `fp` y `pe` pasan a n = 5 (umbral 5/5); el resto se queda en 2 (umbral 2/2). `g8` y `pe` son los escenarios donde falló E0 del control en el spike (`readings/totales.md`: `g8` 1/2 en cada tanda, `pe` 3/5 y 4/5); `g9`, el de E4w (0/4). Un «falla» aislado (4/5) es rojo solo si la relectura del hilo lo confirma (decisión 7); confirmado, va al REFACTOR, porque esos fallos son justo los que la feature quiere quitar.
3. **RED**: el kit de `HEAD` tras la Task 1 (el núcleo actual con la batería arreglada) en `g9`, `fp`, `g8` y `pe` a n = 5, 20 sujetos. Es el RED de las cuatro piezas y de la regla de `fp`.
4. **GREEN**: la batería del entrevistador entera con su n (34 sujetos); la de forma, `tests/batteries/sdd-grilling/`, en los escenarios que la del entrevistador no repite (`g4 g5 g6 g7 t1 sk sk-c fl ag k1 u1`, 19 sujetos), como pasada por las skills que invocan la entrevista y no regresión de las reglas que se reescriben; `m2` de `tests/batteries/sdd-roadmap/` (n = 3, umbral 2/3), que cubre la entrevista de una propuesta; y el tramo de las dos skills de entrada que se tocan (Art. I): `e1` de `sdd-explore` (n = 2) y el humo `n4` de `sdd-init` (n = 1). Cada paso tocado, con su escenario: `sdd-explore` paso 2 → `g1 g9 rq` y `e1`, `u1`; `sdd-init` paso 3 → `g2 g8` y `n4`; `spec-writing.md` → `g3 p1 p2 p3 fp pe`; `proposal.md` → `m2`; `sdd-config` paso 2 → `g7`; núcleo → todos. Las paradas de `sdd-init`, `sdd-roadmap` y `sdd-config` no tienen fila de parada propia: dicen con palabras lo que hoy hace cada paso (`g7`, «cuándo para y las dos listas», ya lo mide en `sdd-config`), y escribir una fila nueva por cada una no cabe en esta feature; si una entrevista de esas no para, su escenario lo enseña como pregunta de más (E3, E5).
5. **Verde** es cada fila de fondo de la rúbrica (K, E0–E7, E4w) con todos sus sujetos en «pasa» o «no aplica»; los reparos no cuentan. En la de forma, su umbral por escenario.
6. **Un sujeto que no carga el núcleo se relanza una vez**, como en el spike (su decisión 10), también el que cae por un `Read` con `limit` explícito sobre el fichero entero, y el relanzamiento se cuenta en el walkthrough; un segundo «no cargó» es rojo de K.
7. **Lectores**: Sonnet con effort medium, uno por escenario y tanda, con el encargo del spike (`readings/encargo.md`) adaptado a la rúbrica de esta batería; el hilo relee cada «falla» y la fija con la regla de `readings/relectura.md`.
8. **REFACTOR**: como mucho dos rondas, cada una sobre los escenarios en rojo; tras la última, el GREEN entero otra vez (las tres baterías), para que el recorte no rompa lo que ya pasaba. Si siguen en rojo, paro y te lo enseño (desvío de la spec).
9. **Tope de gasto**: `COST_CAP=44` (dólares), el techo de toda la campaña de sujetos que suma `battery.mjs` con el precio de plan: el peor caso de la previsión (42,76 $) cabe; paro antes de pasarlo.
10. **La fila K de máquina**: `tools: /^>>> (Skill: \S*sdd-grilling(\s\|$)\|Read: [^\n]*sdd-grilling[\\/]SKILL\.md(\n\|$)\|(Bash\|PowerShell): ([^\n]*[;&\n] *)?(cat\|Get-Content) (?![^;&\|\n]*(-TotalCount\|-Tail\|-Head\|-First\|>))[^;&\|\n]*sdd-grilling[\\/]SKILL\.md(?![\w.])[^;&\|\n]*([;&\n]\|$))/` ausente (la fila falla si ninguna llamada la casa): `Skill`, `Read` sin `limit` ni `offset`, o `cat` y `Get-Content` en un tramo sin tubería, redirección ni parámetro de lectura parcial. `battery.mjs` la aplica a cada llamada (`>>>` hasta la siguiente), no a la primera línea del fichero. Probada en 18 llamadas de muestra (8 casan, 10 no).
11. **`Read` con `offset` o `limit` se ve en el `tools.txt` y en el transcript**: `tests/headless/extract.mjs` y `describeCall` de `transcript.mjs`, que no sale de `extract.mjs`, lo añaden tras la ruta (`<ruta> · offset=<n> · limit=<n>`), para que la K y el lector distingan la lectura entera. El cambio de `extract.mjs` vale para todas las baterías: la Task 1 comprueba con `git grep` que ninguna comprobación existente casa con lo que va tras la ruta de un `Read`.
12. **`transcript.mjs` no corta ninguna llamada de `Bash`, `PowerShell` ni `Read`**; corta solo el volcado JSON de las herramientas sin argumento conocido, a 160 caracteres. Con test en `cli/test/kit/`.
13. **Territorio en cada llamante** (lo confirma el RED-GREEN de la batería; en `sdd-roadmap` y `sdd-config`, que la batería del entrevistador no cubre, `m2` y `g7`):
    - `sdd-explore`, paso 2 «Think»: cubre el porqué, si ni el usuario ni el proyecto lo dicen, y la dirección que se piensa; para con la parada por defecto del núcleo (cada decisión del usuario contestada o pendiente) y confirma la dirección con una sola pregunta.
    - `spec-writing.md`: cubre primero para qué lo quiere, abierto, si ni la petición ni la fila lo dicen; después objetivos, no objetivos y antiobjetivos; para con la parada por defecto, y lo de método que queda va a ✋ como «decidido por mí»; lo no contestado, a la línea nueva «Pendiente de ti» del ✋ de `spec-template.md`, que el dev-lead lee en el gate. La prueba de parada de Addy Osmani (research §7, «puedes predecir su respuesta») se descarta: no es un predicado observable (Art. II) y ninguna fila la mide; la parada por defecto la mide E7 en `pe`.
    - `sdd-init` paso 3: cubre la tabla, «Problem it solves» primero; para cuando cada tema está contestado, pendiente («no sé») o cerrado («no aplica»).
    - `proposal.md`: cubre cada regla de negocio con su ejemplo y el reparto; para cuando cada regla tiene su ejemplo y cada feature su orden y su dependencia.
    - `sdd-config` paso 2: para cuando no queda clave sin valor ni clave que el usuario pidió cambiar.
14. **La regla de `fp`**: en `spec-writing.md`, la respuesta que el usuario mantiene tras el rebate va a «Decisiones tomadas con el dev-lead» con su frase literal, también cuando pide algo que ya existe, y la entrevista sigue sobre lo que pidió.
15. **El núcleo, de cero**: un borrador mide 797 palabras con `wc -w`, frente a 887 del núcleo de hoy con el mismo conteo (888 con el de `word-budget` sobre `dist/`). La postura acota «decidir el método» de research §4: decide lo que un hecho del caso zanja y pregunta lo que tiene varias alternativas defendibles, para no chocar con «Alternativas reales» ni con las preguntas de diseño de método (hallazgo de la review). Las piezas de research §4 sustituyen cada una su frase («Grill relentlessly…», «Facts are your job…», la búsqueda web «keep asking what doesn't depend on it», la pregunta abierta); «If neither the user nor the project says why…, ask that first» y «Stop when no decision is left… from `sdd-explore`, confirm with one question» bajan a sus llamantes.
16. **`upstream.json`**: se quedan las dos entradas `concept` de `sdd-grilling` (de Matt queda el orden por dependencias; de `brainstorming`, pensar varias ideas y la regla de E0). La nota de `brainstorming` dice eso, y el porqué primero pasa a la entrada de `spec-writing.md`.
17. **La tabla «Procedencia de las reglas» de `tests/batteries/sdd-grilling/battery.md` se reescribe** con las reglas del núcleo nuevo, su origen (spike 0341 y esta feature) y sus escenarios; las que bajan a un llamante dicen a cuál.
18. **La fila de `README.md`** de `sdd-grilling` dice lo que hace el núcleo nuevo, con sus dos fuentes.
19. **La carpeta va en `.docs/sdd/specs/`**, como la 0341: `changes/` empieza con el corte de la 3.0.0 (fila 0343), y `battery.mjs plan` busca los precios en `specs/`.
20. **El delta, probado en una copia de `.docs/sdd`**: `sdd capability merge` → siete requisitos sustituidos o añadidos y las tres reglas sustituidas, sin rechazos.
21. **Topes de palabras**: los de la tabla de abajo; cada territorio se compensa en su mismo paso, y si uno no cabe, su tope sube lo justo, con un techo: la suma de las subidas no pasa de 83 palabras, lo que baja el tope del núcleo (900 → 817). Subir un tope es decisión del dev-lead (Art. I): al aprobar la spec apruebas ese techo. El saldo de las skills tocadas, contadas juntas, queda en 0 o menos.
22. **`THIRD_PARTY_NOTICES.md`** sale de `upstream.json` (`moon run kit:notices`): la nota de `brainstorming` cambia con la decisión 16, sin editarlo a mano.
- Política de modelos: revisores de la spec, dos Sonnet (sin reglas de negocio ni roles) · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos Sonnet por tandas de 5 (`MAX_PARALLEL` de `run.mjs`), la persona de `pe` Haiku, lectores Sonnet effort medium de 3 en 3 · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden tus instrucciones

### Hallazgos de la review

Dominio:
- **Aceptado** — (Crítico) la AND de «decide él lo de método» cambia sin declararlo «Alternativas reales» y choca con las preguntas de diseño de método → la AND se acota (decide lo que zanja un hecho del caso; pregunta lo que tiene varias alternativas defendibles), `MODIFIED` de «Alternativas reales» y decisión 15; el borrador del núcleo, igual.
- **Aceptado** — un llamante sin parada propia se queda sin regla de fin → parada por defecto (cada decisión del usuario contestada o pendiente) en el GIVEN de «Cuándo para», en «Límites» y en el núcleo.
- **Aceptado** — «puede predecir la respuesta» y «puede recomendar una dirección» no son predicados observables (Art. II) → `sdd-explore` y `sdd-propose` paran con la de por defecto, que mide E7; Osmani se descarta (decisión 13).
- **Aceptado** — en `sdd-propose`, lo pendiente acababa en «Decisiones que he tomado yo» → va aparte, como pendiente.
- **Rechazado** — la insistencia tras el rebate solo tiene destino en `sdd-propose` → «Dónde viven los datos» ya dice que lo que devuelve `sdd-grilling` lo escribe quien la invoca; la insistencia vuelve en «decidido por el usuario» con sus palabras, y cada llamante la escribe donde escribe esa lista.
- **Aceptado en parte** — el delta no nombra las cinco reglas → «Idioma de los nombres» se sustituye para incluir la marca de suposición; «Dónde viven los datos» y «Avisos» no cambian y la fusión los conserva (decisión 20).
- **Aceptado** — sin regla para quien pide rondas → «Regla ante conflicto»: gana una decisión por turno, por decisión del dev-lead. La frase «dice una vez por qué» que se añadió aquí la quitó la segunda ronda: ninguna fila la mide (Art. I).
- **Rechazado** — el Art. IX exige un A/B por quitar frases → «todo de golpe» no se quita sin sustituto: la sustituye la regla del dev-lead; las frases de territorio bajan a su llamante, no se quitan; las de research §4 se sustituyen pieza a pieza con su RED; la procedencia de `sdd-grilling` es `concepto`, no `copia` (`THIRD_PARTY_NOTICES.md:48-49`), y la de forma mide la no regresión de lo que se reescribe. Ninguna batería pide rondas: esa AND queda sin fila, como hoy la de rondas.
- **Aceptado** — `THIRD_PARTY_NOTICES.md` no estaba en el Scope → entra, regenerado desde `upstream.json` (decisión 22).
- **Rechazado** — «pide un caso» contradice «El porqué va primero» → pedir un caso no ofrece respuestas ni ejemplos («¿qué harás con el CSV el próximo lunes?»); «El porqué va primero» no cambia de conducta, solo de sitio el texto que la pide (decisión 13), y por eso no va al delta.

Técnica:
- **Rechazado** — (Crítico) la regex sin `m` solo mira la primera llamada → `presenceCheck` de `battery.mjs:70` la aplica a cada llamada que separa `toolCalls` (`battery.mjs:68`), con `^` al principio de cada una; el test de la K lleva una carga en la tercera llamada. Al comprobarlo salió otro fallo, que se corrige: la celda decía `presente` y la columna es «Falla si…», así que va `ausente` (decisión 10).
- **Aceptado** — `Read` en la última línea sin salto → `(\n|$)`.
- **Aceptado** — `Get-Content -TotalCount`/`-Tail`, `cat … > x` y `SKILL.md.bak` pasaban → lookahead que los excluye y fin de nombre tras `SKILL\.md`; probado en 18 llamadas.
- **Aceptado** — `Skill: \S*sdd-grilling` sin fin → `(\s|$)`; el relanzamiento por `Read` con `limit` explícito cuenta (decisión 6).
- **Aceptado** — `transcript.mjs` no sale de `extract.mjs` (su `describeCall` es propio) → también añade `offset` y `limit`; la comprobación con `git grep` pasa a ser paso de la Task 1 (decisión 11).
- **Aceptado** — el test reimplementaba la sustitución de `\|` → usa `verdict` de `battery.mjs` sobre la celda real.
- **Aceptado** — el saldo −9 no casaba con los topes por skill → cada territorio se compensa en su paso; si no cabe, su tope sube con lo que libera el núcleo; saldo entre −93 y 0. Medir los territorios antes de aprobar se rechaza: escribirlos es la Task 3, y la regla de compensación ya fija el resultado.
- **Aceptado** — 96 sujetos no cuadraba y faltaba el GREEN tras el REFACTOR → 176 sujetos en el peor caso, 42,14 $ de sujetos, `COST_CAP=43` (decisiones 8 y 9).
- **Aceptado** — paradas sin fila y ADDED que pasa con la palabra → parada por defecto medida por E7; E0 la juzga el lector por la conducta, no por la palabra («Dónde se prueba»). La AND de leer antes de preguntar no tiene escenario propio: E3 queda fuera de alcance por el brief.
- **Aceptado en parte** — decisiones del cuerpo fuera del ✋ → el umbral 2/2 va a la decisión 2; el kit copiado y `RUNS_DIR` son «Partes que fija B» del Approach, y la ubicación de los tests, «Dónde se prueba». Las dos líneas de revisores no se contradicen: «Mínimo razonable» es la forma fija del bloque.

Segunda ronda (un revisor Sonnet con los siete puntos, por el Crítico aceptado del dominio):
- **Aceptado** — (Crítico) el separador del escenario ADDED era una decisión con varias alternativas que el agente fijaba solo, contra la AND acotada → el separador se pregunta o queda pendiente; el ejemplo de «decidido por mí» pasa a la codificación, que zanja un hecho del proyecto; la suposición queda pendiente de confirmar.
- **Aceptado** — «dice una vez por qué sigue de una en una» es guidance sin fila (Art. I) → quitada del delta y del núcleo; queda solo «una por turno, también si lo pide todo de golpe», decisión del dev-lead.
- **Aceptado** — «pendiente» sin predicado → definido en el GIVEN de «Cuándo para» y en el núcleo: el usuario dijo no saberla, o la dejó sin contestar tras preguntarla una vez.
- **Aceptado en parte** — las paradas de `sdd-init`, `sdd-roadmap` y `sdd-config` sin escenario propio → cada paso tocado lleva su escenario en la decisión 4, con `n4` de `sdd-init` añadido; una fila de parada por skill no se escribe, con el motivo en la decisión 4.
- **Aceptado** — lo pendiente no tenía hueco en la spec → línea «Pendiente de ti» en el ✋ de `spec-template.md` (Scope, decisión 13, topes).
- **Aceptado** — la subida de topes no tenía techo → la suma de subidas no pasa de 83 palabras; al aprobar, el dev-lead aprueba ese techo (decisión 21, Art. I).
- **Aceptado** — sin el tramo de las skills de entrada (Art. I) → `e1` de `sdd-explore` y el humo `n4` de `sdd-init` en el GREEN y en la previsión (decisiones 4 y 9).
- **Aceptado en parte** — 887 frente a 888 → la decisión 15 dice los dos conteos (`wc -w` de `skills/` y `word-budget` de `dist/`). El −73 se rechaza: el saldo se cuenta en palabras escritas (887 → 797, −90), no en topes.
- **Aceptado** — el bloque de review contaba seis requisitos → seis MODIFIED, un ADDED y tres reglas.
- **Rechazado** — umbral 5/5 con n = 5 vuelve rojo un fallo aislado → un «falla» solo cuenta si lo confirma la relectura del hilo (decisión 7); confirmado, es justo el fallo de E0 que la feature quiere quitar, y el peor caso ya paga dos rondas (decisión 2).

### Decisiones tomadas con el dev-lead

- Insistir tras el rebate es decisión del usuario: se apunta y la entrevista sigue (E1 turno 2 entra, opción 1️⃣) — «1» (2026-11-13)
- Núcleo de cero, menos de 887 palabras, reglas en positivo, una prohibición solo como guardarraíl junto a su positivo, lo traído sustituye una regla y nunca se suma — «se trata de construir algo que funcione... modificar lo que no funciona no añadir más... y evitar no hagas esto» (2026-11-13, brief de la 0342)
- Una pregunta por turno, nunca por rondas — «lo habitual es decir sí a todo» (2026-11-13, brief)
- La plantilla de la pregunta se queda (título, opciones con su coste, «➡️ recomiendo X, porque…») — «me gusta ver las cosas bonitas» (brief)
- Lo que solo sabe el usuario, abierto, sin recomendación ni menú; lo que decide el agente, marcado como suyo — brief de la 0342, research §4 y §8: «Sí, con esa versión»

## Intent

Hoy el núcleo de `sdd-grilling` mezcla cómo se pregunta con qué cubre cada entrevista, y la batería del spike 0341 lo deja en rojo en tres sitios: da por confirmado lo que el usuario no contestó (E0: `g8` y `pe`), no busca en la web antes de preguntar (E4w, `g9` 0/4) y vuelve a rebatir tras «mantengo lo que dije» (E1, `fp` 2/10). El éxito: la batería del entrevistador en verde con su n en todas sus filas de fondo, la de forma sin regresión, un núcleo de menos de 887 palabras en positivo y el saldo de palabras de las skills tocadas en 0 o menos. Fracasa aunque funcione si el núcleo nuevo pasa la batería sumando reglas a las de hoy, o si una entrevista pierde su parada al bajar el territorio a su llamante.

## Scope

- Entra:
  - `skills/sdd-grilling/SKILL.md`, de cero.
  - El territorio (qué cubre, cuándo para) en `skills/sdd-explore/SKILL.md`, `skills/sdd-init/SKILL.md` paso 3, `skills/sdd-propose/references/spec-writing.md`, `skills/sdd-roadmap/references/proposal.md` y `skills/sdd-config/SKILL.md` paso 2, con la regla de `fp` en `spec-writing.md`.
  - Batería: la fila K y la n en `tests/batteries/interviewer/battery.md`; `tests/batteries/interviewer/transcript.mjs` sin cortar las llamadas que leen ficheros y con `offset` y `limit` de `Read`; `tests/headless/extract.mjs` con `offset` y `limit` de `Read`; tests en `cli/test/kit/`.
  - `tests/batteries/sdd-grilling/battery.md`, tabla de procedencia; `.docs/sdd/capabilities/interviewing.md` (al fusionar); `upstream.json` y `THIRD_PARTY_NOTICES.md`, que sale de él; `README.md`; `cli/test/kit/word-budget.test.ts`.
  - `skills/sdd-templates/templates/spec-template.md`: la línea «Pendiente de ti» en el ✋ (decisión 13).
  - Saldar la fila de `.docs/sdd/steering/debt.md` del transcript que corta a 160 caracteres, y la 0342 de `ROADMAP.md`.
- No entra:
  - El cierre y el corte de la 3.0.0 (fila 0343).
  - Reglas nuevas para no preguntar lo que la petición ya dice (E3): la postura del núcleo ya lo pide («read what answers it: the request, its roadmap row…»), sin regla de `sdd-propose` aparte.
  - Otras baterías de las skills llamantes, salvo `m2` de `sdd-roadmap`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Grill relentlessly until nothing is left silently assumed…» | `skills/sdd-grilling/SKILL.md:12`; `interviewing.md`, «Una decisión por turno», última AND; `tests/batteries/sdd-grilling/battery.md:86` | sustituida por la postura (decisión 15); delta `MODIFIED`; procedencia reescrita (decisión 17) |
| «Facts are your job; decisions are the user's.» | `skills/sdd-grilling/SKILL.md:12` | sustituida por la regla de E0; delta `ADDED` |
| «If the user asks for everything at once, do so this session» | `skills/sdd-grilling/SKILL.md:16`; `interviewing.md`, «Una decisión por turno» y «Regla ante conflicto» | retirada: nunca por rondas (dev-lead); delta `MODIFIED` |
| «If neither the user nor the project says why…, ask that first» | `skills/sdd-grilling/SKILL.md:12`; `tests/batteries/sdd-grilling/battery.md:87`; `upstream.json`, nota de `brainstorming`; `THIRD_PARTY_NOTICES.md:49` | baja a `spec-writing.md` y a `sdd-explore` (decisión 13); procedencia y nota (decisiones 16, 17 y 22) |
| «one defensible path: say it, confirm it» | `skills/sdd-grilling/SKILL.md:37`; `interviewing.md`, «Alternativas reales», última AND | la de método la decide el agente; la del usuario se dice y se confirma; delta `MODIFIED` |
| «If it needs a web search, use a subagent and keep asking what doesn't depend on it» | `skills/sdd-grilling/SKILL.md:20`; `interviewing.md`, «Busca fuera», segunda AND | sustituida: la búsqueda se lanza antes de la primera pregunta; delta `MODIFIED` |
| «Stop when no decision is left… from `sdd-explore`, confirm with one question» | `skills/sdd-grilling/SKILL.md:58`; `interviewing.md`, «Cuándo para la entrevista» | la parada pasa a cada llamante (decisión 13); delta `MODIFIED` |
| «sin tope de preguntas por entrevista (para con la frontera vacía)» | `interviewing.md`, «Límites» | para donde fija la skill que la invoca; delta, Reglas de la capacidad |
| `const ARG_MAX = 160;` | `tests/batteries/interviewer/transcript.mjs:10` y `:30`; `debt.md:58` | solo para el volcado JSON (decisión 12); la fila de `debt.md` se salda |
| `tools: /sdd-grilling/` presente (fila K) | `tests/batteries/interviewer/battery.md:31` | regex de la decisión 10 |
| `extract.mjs` escribe de `Read` solo la ruta | `tests/headless/extract.mjs:92` | añade `offset` y `limit` (decisión 11) |
| «adaptada de `grilling` de Matt Pocock (MIT)» | `README.md:110` | decisión 18 |
| `'sdd-grilling': { skillMd: 900, total: 900 }` | `cli/test/kit/word-budget.test.ts:19` | tope nuevo de la tabla de abajo |

- Filas que implementa: 0342 → `ROADMAP.md:164`, que cierra el cierre de la feature; la fila de `.docs/sdd/steering/debt.md:58` («El lector de la batería del entrevistador no ve qué fichero lee un sujeto…»), que se salda; la 0338 ya está fundida en la 0342 (`git grep -n '\b0338\b'` fuera de las carpetas de evidencia: nada).

## Approach

- **A — Todo el territorio de hoy, copiado a sus llamantes de una vez**: cada frase del núcleo que dice qué cubre o cuándo para se mueve a su skill sin medir. Es lo más rápido, pero añade palabras en cinco skills sin saber cuáles hacen falta, y la hipótesis de la 0338 queda sin RED.
- **B — Núcleo sin territorio, y el territorio en cada llamante en una o dos frases medidas**: el núcleo dice solo cómo se pregunta. Cada llamante recibe qué cubre su entrevista y cuándo para (decisión 13), y el RED-GREEN de la batería dice si cada frase hace falta: la que no mueve ninguna fila se quita en el REFACTOR. Cuesta una tanda de batería más y alguna ronda de REFACTOR.
- **C — Territorio en el núcleo, por secciones de cada llamante**: no baja nada. Contradice la 0338 fundida en la 0342 y la decisión del dev-lead de que el núcleo diga solo cómo se pregunta.
- **Elegido: B**, porque es el único que pone a prueba la hipótesis que pide el brief («la confirma un RED») y el único que puede bajar el saldo de palabras con datos: una frase de territorio que no cambia ninguna fila no se queda.

Partes que fija B:
- El núcleo se ordena así: postura (mirar, decidir el método, preguntar lo que queda, y lo decidido por el agente como suyo), una decisión por turno, buscar, forma de la pregunta, lo que solo sabe el usuario, respuestas y final. Cada regla va en positivo; una prohibición va solo como guardarraíl, junto a su positivo.
- Orden de las tasks: arreglos de la batería → RED con el núcleo actual → núcleo y territorios → GREEN con REFACTOR → pasada por las skills llamantes, topes y cierre.
- El kit de cada tanda sale de `dist/` construido (`moon run kit:build`), copiado a `.temp/i/kit` sin `.docs/` ni `tests/`; `RUNS_DIR` en `.temp/i/runs` (operations.md, ruta corta).

## Dónde se prueba

- La fila K casa con la lectura entera y no con otra mención: Vitest en `cli/test/kit/headless/battery.test.ts`, con `verdict` de `battery.mjs` sobre la celda real de `tests/batteries/interviewer/battery.md` (sin copiar la sustitución de `\|`), y las 18 llamadas de muestra de la decisión 10: entre ellas la carga en la tercera llamada, `Read` en la última línea sin salto, `Get-Content -TotalCount` y `-Tail`, `cat … | head -80`, `Read` con `limit` y `cat spec-writing.md` con «Ask with `sdd-grilling`» en su resultado.
- `transcript.mjs` no corta las lecturas y enseña `offset` y `limit`: Vitest nuevo en `cli/test/kit/interviewer-transcript.test.ts`, con un `Bash` de más de 160 caracteres que lee `sdd-grilling/SKILL.md` al final y un `Read` con `limit`.
- Lo del usuario sin contestar queda pendiente: E0 en `g8` y `pe`, que el lector juzga por si el agente usó como confirmado lo no contestado, no por la palabra «pendiente». La parada por defecto: E7 en `pe`.
- `extract.mjs` muestra `offset` y `limit`: el mismo patrón que sus tests actuales en `cli/test/kit/headless/`.
- La conducta de la entrevista: `tests/batteries/interviewer/` (RED y GREEN), `tests/batteries/sdd-grilling/` y `m2` de `tests/batteries/sdd-roadmap/` (GREEN), leídas por los lectores y por el hilo.
- Topes y forma: `moon run kit:build kit:skill-size kit:own` y `cli/test/kit/word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: **núcleo** — `skills/sdd-grilling/SKILL.md`, cómo se pregunta; **territorio** — qué cubre una entrevista y cuándo para, en la skill que la invoca.
- ADR candidatas: el núcleo dice cómo se pregunta y cada llamante su territorio — alternativa descartada: un núcleo con secciones por llamante (C).

## Delta de comportamiento

### Capacidad: `interviewing`

#### MODIFIED — Una decisión por turno

- GIVEN una entrevista de `sdd-grilling` con el porqué ya dicho y tres decisiones abiertas sin dependencia entre ellas (nombre del comando, formato de salida, si admite filtro)
- WHEN el agente pregunta
- THEN el turno termina con una sola decisión, la que más cambia el resto (la que reabre otras ramas va primero)
- REMOVED AND si el usuario pide en la sesión «pregúntamelo todo de golpe», en esa sesión pregunta por rondas
- AND si el usuario pide «pregúntamelo todo de golpe», sigue con una decisión por turno
- AND en otra entrevista, una decisión que depende de otra todavía abierta espera a que esa se cierre (enmienda 2026-10-03)
- REMOVED AND no termina con nada supuesto en silencio: cada suposición del agente es una pregunta o una entrada de «decidido por mí» (enmienda 2026-10-03)
- AND antes de cada pregunta lee lo que la contesta (la petición, su fila del roadmap, los documentos y el código del proyecto); lo de método o técnica que zanja un hecho de este caso lo decide él, con ese hecho; lo que tiene varias alternativas defendibles lo pregunta; y pregunta siempre lo que es del usuario: para quién, para qué, alcance, nivel y dinero

#### MODIFIED — Alternativas reales, mezclas incluidas

- GIVEN una decisión con dos alternativas defendibles y una tercera que nadie elegiría («ni clave ni salida en sesión»)
- WHEN el agente la pregunta
- THEN ofrece solo las dos defendibles, y la mezcla de ambas si combinarlas es defendible
- AND con cinco alternativas defendibles ofrece las cinco: no hay número fijo
- REMOVED AND con una sola alternativa defendible la dice y pide confirmarla, y no añade una mezcla 🔀 que no defendería sola (enmienda 2026-10-03)
- AND con una sola alternativa defendible, si es de método la decide y la anota en «decidido por mí» con su motivo; si es del usuario, la dice y pide confirmarla; y no añade una mezcla 🔀 que no defendería sola

#### ADDED — Lo que decide el agente va como suyo

- GIVEN una entrevista de `sdd-propose` para exportar a CSV en la que el usuario no ha contestado para qué lo quiere ni ha dicho qué hoja de cálculo usa
- WHEN el agente sigue
- THEN el para qué queda pendiente, no «lo tomo como confirmado y lo uso como base»
- AND el separador, que depende de la hoja que el usuario no ha dicho, se pregunta o queda pendiente; no sale «**Separador:** coma» como hecho
- AND lo que zanja un hecho del proyecto (la codificación UTF-8, porque los ficheros de `data/` ya la usan) va como «decidido por mí» con ese hecho, nunca como algo que el usuario aceptó
- AND si para seguir supone algo que ningún hecho zanja, lo dice como suposición y lo deja pendiente de confirmar

#### MODIFIED — El descubrimiento no se ancla

- GIVEN una pregunta sobre lo que solo sabe el usuario («¿quién usa el producto?») en un proyecto sin código
- WHEN el agente la pregunta
- REMOVED THEN la hace abierta, sin recomendación ni hipótesis
- THEN la hace abierta, en una sola frase que pide un caso, sin recomendación, hipótesis ni ejemplos de respuesta
- AND en un proyecto con código donde encontró `roles.ts` con `clinic_admin` y `patient`, enseña ese hecho con su fuente y pide confirmarlo, sin recomendar

#### MODIFIED — Rebatir una vez

- GIVEN una respuesta del usuario que choca con un hecho del proyecto, o una premisa floja en lo que pide
- WHEN el agente la recibe
- THEN la rebate una vez, con el argumento y la alternativa concreta
- AND si el usuario mantiene su respuesta, la acepta y sigue, sin volver a rebatirla
- AND en `sdd-propose`, lo que el usuario mantiene va a «Decisiones tomadas con el dev-lead» con su frase literal, también cuando pide algo que ya existe («mantengo lo que dije» tras saber que `libres` ya está en `src/app.js`), y la entrevista sigue sobre lo que pidió, sin reconvertirlo en un cambio de lo que existe

#### MODIFIED — Cuándo para la entrevista

- REMOVED GIVEN una entrevista en la que no queda ninguna decisión por preguntar
- GIVEN una entrevista que llega a la parada que fija la skill que la invoca o, sin parada propia, a la de por defecto: cada decisión del usuario contestada o pendiente (el usuario dijo no saberla, o la dejó sin contestar tras preguntarla una vez)
- WHEN el agente termina
- THEN devuelve a la skill que la invocó dos listas: lo que decidió el usuario y lo que decidió el agente (con su motivo), más lo pendiente
- AND si la skill que invoca tiene gate (spec, documento de la init, propuesta), la confirmación es ese gate: no pide una confirmación propia antes
- AND invocada desde `sdd-explore`, que no tiene gate, confirma con una sola pregunta
- AND no pregunta lo que la petición ya dice o delega, ni lo que puede averiguar leyendo el proyecto
- AND `sdd-explore` y `sdd-propose` paran con la de por defecto; en `sdd-propose`, lo de método que queda va a «Decisiones que he tomado yo» como «decidido por mí», y lo no contestado, a su línea «Pendiente de ti»
- AND fijan su parada: `sdd-init`, cuando cada tema de su tabla está contestado, pendiente o «no aplica»; `sdd-roadmap`, cuando cada regla de negocio de la propuesta tiene su ejemplo y cada feature del reparto su orden y su dependencia; `sdd-config`, cuando no queda clave sin valor ni clave que el usuario pidió cambiar

#### MODIFIED — Busca fuera del repo antes de preguntar lo que depende de un hecho externo

- GIVEN una decisión que depende de un hecho que el repo no tiene y que cambia con el tiempo: cómo se comporta una librería o herramienta en su versión actual, qué recomienda su documentación oficial, qué hace otro proyecto con el mismo problema o qué exige una licencia
- WHEN el agente va a preguntarla
- THEN antes lo busca, sin que el usuario se lo pida: primero en el repo; después en el MCP de documentación que tenga la sesión para esa tecnología (Context7, Microsoft Learn…), respetando los límites de llamadas que fijen las instrucciones del usuario; si no hay, en internet
- REMOVED AND la pregunta cita lo que encontró con su fuente (enlace o fichero), y solo las decisiones que dependen de esa búsqueda esperan: el resto se pregunta mientras
- AND si la decisión necesita la web, lanza la búsqueda antes de su primera pregunta, también antes de preguntar el porqué, y pregunta mientras busca; la pregunta que depende de ella cita lo que encontró con su fuente (enlace o fichero)
- AND «lo sé de memoria» no vale para lo que cambia con las versiones o con el tiempo; sí para lo estable (qué es una licencia MIT, cómo funciona git)

#### Reglas de la capacidad — interviewing

- **Idioma de los nombres**: el texto que ve el usuario (preguntas, listas «decidido por ti», «decidido por mí», «pendiente», la marca de suposición) va en su idioma; la skill, en inglés.
- **Límites**: una decisión por turno, también si el usuario pide todo de golpe; sin tope de preguntas por entrevista (para donde fija la skill que la invoca, o con cada decisión del usuario contestada o pendiente); rebatir, una vez por respuesta.
- **Regla ante conflicto**: si el usuario pide rondas, gana una decisión por turno (dev-lead); las paradas de `control-profiles` mandan sobre la entrevista.

## Topes de palabras

Medido con el conteo de `cli/test/kit/word-budget.test.ts` sobre `dist/skills/` de `HEAD` (`ebfd253b`).

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-grilling` (SKILL.md y total) | 888 / 900 | 12 | 797 + 20 = 817 (borrador, `wc -w` → 797) |
| `sdd-templates` total (con `spec-template.md`) | sin medir | — | sin cambio: la línea «Pendiente de ti» (~+10) sale del mismo bloque ✋ |
| `sdd-explore` (SKILL.md y total) | 1063 / 1066 | 3 | sin cambio: lo que entra (~+30, sin medir) sale del mismo paso 2 |
| `sdd-init` (SKILL.md y total) | 2667 / 2667 y 3212 / 3212 | 0 | sin cambio: lo que entra (~+25, sin medir) sale del mismo paso 3 |
| `sdd-propose` total (con `spec-writing.md`) | 13857 / 13927 | 70 | sin cambio: lo que entra (~+60, sin medir) sale de la misma sección de `spec-writing.md` |
| `sdd-roadmap` total (con `proposal.md`) | 3267 / 3630 | 363 | sin cambio: lo que entra (~+30, sin medir) sale del mismo apartado |
| `sdd-config` (SKILL.md y total) | 1435 / 1450 | 15 | sin cambio: lo que entra (~+12, sin medir) sale del mismo paso 2 |

Los territorios se miden con `wc -w` al escribirlos en la Task 3, no antes. El test de `word-budget` va por skill: cada territorio se compensa en su paso; el que no cabe sube su tope lo justo, y la suma de subidas no pasa de 83 (decisión 21). El saldo se cuenta en palabras escritas, no en topes: el núcleo baja 90 (887 → 797, `wc -w`). Saldo previsto de las siete skills: entre −90 (todo compensado en su paso) y 0; si el GREEN lo deja por encima de 0, el REFACTOR recorta antes de cerrar.

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="g9 fp g8 pe" N=5 node tests/headless/battery.mjs plan tests/batteries/interviewer/battery.md` → `suma: 20 sujetos · coste previsto: 4.68 $` | 4,68 |
| GREEN, entrevistador | lo de arriba (4,68) + `SCENARIOS="g1 rq g2 g3 p1 p2 p3" N=2 …interviewer/battery.md` → `suma: 14 sujetos · coste previsto: 3.00 $` | 7,68 |
| GREEN, forma | `SCENARIOS="g4 g5 g6 g7 t1 sk sk-c fl ag k1 u1" node tests/headless/battery.mjs plan tests/batteries/sdd-grilling/battery.md` → `suma: 19 sujetos · coste previsto: 5.15 $` | 5,15 |
| GREEN, propuesta | `SCENARIOS="m2" N=3 node tests/headless/battery.mjs plan tests/batteries/sdd-roadmap/battery.md` → `suma: 3 sujetos · coste previsto: 0.72 $` | 0,72 |
| GREEN, entradas | `SCENARIOS="e1" …sdd-explore/battery.md` → `suma: 2 sujetos · coste previsto: 0.20 $`; `SCENARIOS="n4" N=1 …sdd-init/battery.md` → `suma: 1 sujetos · coste previsto: 0.11 $` | 0,31 |
| Dos tandas de REFACTOR | como mucho los cuatro escenarios de n = 5 dos veces (`suma: 20 sujetos · coste previsto: 4.68 $`) | 9,36 |
| GREEN tras el REFACTOR | todo el GREEN otra vez (4,68 + 3,00 + 5,15 + 0,72 + 0,31), solo si hubo REFACTOR | 13,86 |
| Relanzamientos por «no cargó» | ~4 sujetos a ~0,25 $ | 1,00 |
| Sujetos, peor caso | 20 + 34 + 19 + 3 + 3 + 40 + 59 + ~4 = 182 sujetos; es lo que cuenta `COST_CAP` | 42,76 |
| Lectores y revisores | sin comando de previsión: ~4 $ de lectores (el spike: 5,39 $ por 168 transcripts y la review; ahora sin cortar las llamadas, algo más largos) y ~1,5 $ de revisores de la spec, con la segunda ronda | 5,50 |
| Suma, peor caso | | 48,26 |
| Suma, GREEN a la primera | RED, GREEN, relanzamientos, ~2 $ de lectores y los revisores | 23,04 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-13 | aprobada — «1» (Apruebo) |
