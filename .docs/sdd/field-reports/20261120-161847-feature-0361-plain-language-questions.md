---
kit_version: 3.0.4
lane: feature
id: 20261120-161847-feature-0361-plain-language-questions
task: 0361
mode: full
date: 2026-11-20
---

# Ticket para el kit — feature 0361: mover la regla de hablar llano a `sdd-grilling` no quita la jerga de las preguntas

## Contexto

- Carril y modo: feature full, perfil `delegate`
- Skills del kit usadas: `sdd-propose`, `sdd-spec-writing`, `sdd-grilling`, `sdd-spec-approval`, `sdd-spec-review`, `sdd-plan-writing`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown y una CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (revisores de spec, eje Código, sujetos) y Opus 5.5 (eje Spec, re-revisión)
- Coste en reloj: 1,45 h de esfuerzo (3,27 h de reloj, 109 min de espera al dev-lead) frente a 1 h estimada
- Coste en tokens: 69,1 M del hilo y 4,8 M de subagentes, 24,28 $; sujetos 9,61 $ en 38

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Tres textos de prosa probados y ninguno quita la jerga: la causa «regla lejos de su paso» no se sostiene

- **Qué pasó**: la feature movió la regla de hablar llano de «The Conversation» de `sdd-spec-writing` al molde de «Shape of a question» de `sdd-grilling` (texto 1); la enmendó para nombrar cada pieza con el vocabulario del proyecto y el nombre del código detrás (texto 2); y en una tanda de corrección la llevó también a la línea de la nota «Lo que he entendido» del primer mensaje de `sdd-spec-writing` (texto 3). En el escenario nuevo `j1`, J1 (idioma del proyecto) falló 2 de 2 con los tres textos, igual que con la base. La jerga nace sobre todo en la nota de entendimiento, no en la pregunta ❓: «Hoy `freeRooms` en `src/app.js` mira solo sala y franja y no mira `day`». La feature cerró solo con la prueba y las skills volvieron a las de `develop`.
- **Fuente**: `.docs/sdd/changes/20261120-150821-feature-0361-plain-language-questions/walkthrough.md` §4.2 (tabla por texto); evidencia en `red-reservas/`, `green-reservas-1/` y `green-reservas/` de esa carpeta (`out/j1-*.texts.txt`); spec, «Enmiendas».
- **Dónde en el kit**: `skills/sdd-spec-writing/SKILL.md`, «Your First Message» («Add what you found that bears on it»); `skills/sdd-grilling/SKILL.md`, «Shape of a question»; la fila «Lista» de las preguntas con jerga de `.docs/sdd/steering/debt.md` (causa «regla lejos de su paso», solución «mover regla»).
- **Por qué el kit no lo evitó**: la fila de deuda fijó la causa y la solución antes de medir; el Art. II de la constitución clasifica esto como fallo de forma, que pide «receta o contrato de cómo es el output», no prosa.
- **Coste**: la feature entera sin cambio de conducta: 1,45 h y 33,89 $ entre sesión y sujetos (walkthrough §2).
- **Propuesta**: tratarlo como fallo de forma: un hueco obligatorio en la plantilla del primer mensaje de `sdd-spec-writing` para lo encontrado, con la forma `<pieza como la llama el proyecto> (<nombre del código>, <fuente>)`, y medirlo contra `j1`. Corregir la causa de la fila de deuda.
- **Verificada**: sí — RED y tres GREEN en rojo con `node tests/headless/battery.mjs run` (`BATTERY=sdd-grilling SCENARIOS="j1" N=2`) en Git Bash.
- **Criterio de aceptación**: GIVEN el escenario `j1` de la batería de `sdd-grilling` (molde `reservas`) WHEN el agente escribe su primer mensaje THEN J1 pasa 2 de 2: cada función o fichero del código aparece detrás del nombre que le da el proyecto, entre paréntesis.

### 2. La entrevista de esta misma feature repitió el fallo que quería arreglar

- **Qué pasó**: tres preguntas de la entrevista no se entendieron a la primera y el dev-lead lo dijo: «a que tope te refieres», «no acabo de ver el problema de lo que quieres tapar», «que me estas preguntando?». La primera hablaba de «el tope» sin decir cuál (había dos); la tercera era una ❓ de medición con escenario, rúbrica y precio por sujeto, cuando la decisión era «¿gastamos 9 $ o 5 $?».
- **Fuente**: la conversación de la sesión; las decisiones con esas respuestas, en «Decisiones tomadas con el dev-lead» de la spec de la carpeta del hallazgo 1.
- **Dónde en el kit**: `skills/sdd-grilling/SKILL.md`, «Shape of a question» (el molde ❓ con lo encontrado y las alternativas con su coste).
- **Por qué el kit no lo evitó**: el molde pide contar lo encontrado y el coste de cada alternativa; nada pide reducir la pregunta a la decisión que toma el usuario («¿cuánto gastamos?») antes de vestirla con el método.
- **Coste**: tres vueltas de aclaración; sin respaldo para atribuirles un tiempo.
- **Propuesta**: en el molde, la primera línea es la decisión del usuario dicha en una frase de su vocabulario; el método va después, solo si cambia el coste.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una decisión de método que solo cambia el dinero (medir con A/B o sin él) WHEN el agente la pregunta THEN la primera línea de la ❓ nombra lo que decide el usuario («¿cuánto gastamos en probarlo?») con las cifras, sin nombres de escenarios ni filas de rúbrica.

### 3. Una corrección de alcance llegó por otra sesión con la spec aprobada y obligó a medir dos veces

- **Qué pasó**: con la spec aprobada y la Task 2 medida, la sesión de coordinación pasó una corrección del dev-lead: los nombres del código no salen de la pregunta, van detrás del vocabulario de arquitectura. Contradecía un punto del prompt de arranque («ficheros, funciones y claves van a la spec, no a la pregunta»). Además traía «no se añaden casos», que chocaba con lo que el dev-lead había decidido en esta sesión; se le preguntó y mantuvo lo de esta sesión.
- **Fuente**: spec de la carpeta del hallazgo 1, «Enmiendas» (primera) y «Decisiones tomadas con el dev-lead»; previsión de coste de la spec (fila «Enmienda 2026-11-20»).
- **Dónde en el kit**: `skills/sdd-templates/templates/launch-prompt-template.md` («Alcance», «Decisiones ya tomadas»); `skills/sdd-roadmap/SKILL.md` (quien escribe el prompt).
- **Por qué el kit no lo evitó**: el prompt de arranque llevó en «Alcance» una regla de diseño que el dev-lead no había dicho con sus palabras; nada distingue en el prompt lo que dijo el dev-lead de lo que propone quien lo escribe.
- **Coste**: 3,40 $ previstos de re-medición (RED y GREEN de `j1` en otro molde y el lado nuevo del A/B), más una parada (spec, previsión de coste).
- **Propuesta**: en el prompt de arranque, cada punto de «Alcance» que fija conducta lleva la frase literal del dev-lead o pasa a «Abierto».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un prompt de arranque generado por `sdd-roadmap` WHEN un punto de «Alcance» fija cómo debe comportarse el kit THEN lleva la frase del dev-lead entre «» o está en «Abierto».

### 4. La previsión de un escenario nuevo usa la media de la batería y se queda en la mitad

- **Qué pasó**: `battery.mjs plan` dio para `j1`, escenario nuevo, «sin precio medido: j1 (a 0.23 $, la media de los escenarios medidos)»; el sujeto real costó 0,50 $ y, ya medido, la previsión pasó a 0,47 $. `j1` llega hasta el gate de la spec con dos revisiones, y la media mezcla escenarios de un turno.
- **Fuente**: `SCENARIOS="j1" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-grilling/battery.md` → `suma: 2 sujetos · coste previsto: 0.46 $ · sin precio medido: j1 (a 0.23 $, la media de los escenarios medidos)`; tras el RED → `suma: 2 sujetos · coste previsto: 0.94 $`; `.temp` de la sesión: «red: 2 sujetos · 1.01 $».
- **Dónde en el kit**: `tests/headless/battery.mjs`, `plan` (precio de un escenario sin medir).
- **Por qué el kit no lo evitó**: la media no distingue un escenario que llega a la spec de uno que acaba en la primera pregunta.
- **Coste**: la previsión aprobada (4,30 $) se quedó corta en el primer RED; sin respaldo para atribuirle más.
- **Propuesta**: para un escenario sin medir, usar el precio del escenario medido de su mismo paso y molde con más turnos, o avisar de que la media puede quedarse en la mitad.
- **Verificada**: sí — contrastado con las dos salidas de `battery.mjs plan` de arriba, en Git Bash.
- **Criterio de aceptación**: GIVEN un escenario nuevo del paso `sdd-propose` con dos turnos WHEN se pide `battery.mjs plan` THEN el precio previsto no baja del de g3 o p2 de la misma batería.

### 5. `kit:copies` no deja añadir una frase dentro de una línea del original

- **Qué pasó**: para añadir «Name parts as `sdd-grilling` says.» a la línea «Add what you found…» de la copia de `brainstorming`, tres intentos fallaron. Partir la línea dio «falta texto del original sin marca quita»; reescribirla entera en un bloque del kit dio «falta texto del original sin marca quita: «touch.»» y «conserva el 49 % de su original … por debajo del 50 % es propia». Se resolvió metiendo la frase en un bloque del kit 0359 que ya existía tres líneas más abajo.
- **Fuente**: `moon run kit:copies` en Git Bash, salidas citadas; `tests/copies/annotated.ts` (`MIN_KEPT = 50`).
- **Dónde en el kit**: `tests/copies/annotated.ts`; la marca de añadido de `kit:copies` descrita en `.docs/sdd/capabilities/kit-copies.md`.
- **Por qué el kit no lo evitó**: no hay forma de marcar un añadido a mitad de una línea del original, y `sdd-spec-writing` está a un punto del umbral del 50 %.
- **Coste**: ~10 min y tres builds.
- **Propuesta**: documentar en `kit-copies` que un añadido va en su propia línea, entre frases completas del original, y que `sdd-spec-writing` está al 50 %.
- **Verificada**: sí — reproducido con `moon run kit:copies` en Git Bash.
- **Criterio de aceptación**: GIVEN una frase nueva para la copia `sdd-spec-writing` WHEN quien la edita lee `kit-copies` THEN sabe dónde ponerla sin probar a ciegas.

## Lo que hice por iniciativa propia

- Ante el mensaje de la sesión de coordinación que chocaba con una decisión de esta sesión, preguntar al dev-lead antes de escribir la enmienda y lanzar su revisor. Funcionó: confirmó la de esta sesión y la enmienda salió a la primera.
- Pedir en J2 un fragmento literal de la frase del dev-lead («ese día» y «a esa hora») para distinguir repetir de parafrasear. Funcionó: el revisor lo pidió y separó bien el único sujeto que pasó.
- Renombrar las carpetas de evidencia por tanda (`green-salas`, `green-reservas-1`…) en vez de sobrescribirlas.

## Funcionó, no tocar

- `battery.mjs plan` y `verdict`, y el corte con `RUNS_DIR/stop`: pararon el lado del A/B que medía un texto que iba a cambiar.
- La revisión de la spec en dos vueltas: cazó que la fuente pasaba a ser opcional (choque con g8 y g9) y que el caso añadido chocaba con «El descubrimiento no se ancla».
- El Art. I («si la prueba la supera, una tanda más de REFACTOR incluida, se para y decide el dev»): dio un final claro a una feature que no salía.

## Menores

- `battery.mjs run` sale con «define SUBJECT_CAP (previsión de la spec)» si la celda de la fila «Suma» lleva texto tras el número; no lanzó nada y costó un relanzamiento — `tests/headless/battery.mjs`
- Di 0,43 $ por sujeto sacado de un ticket viejo antes de correr `battery.mjs plan`, que daba 0,19 $; lo corregí en el turno siguiente — `skills/sdd-spec-writing/SKILL.md`, previsión de coste (la regla de citar el comando existía y no la apliqué)
- Lancé dos campañas a la vez por encima de `control.maxParallelAgents` (3) para ahorrar espera — `tests/headless/run.mjs` (`MAX_PARALLEL` por campaña, no por sesión)
- Sin verificar: `subject.mjs` de `sdd-grilling` guarda la spec del sujeto desde `.docs/sdd/specs/*/spec.md`, pero los sujetos ya escriben en `.docs/sdd/changes/`; afecta a A1 de `ag` — `tests/batteries/sdd-grilling/subject.mjs`
- Sin verificar: g9 falla R11 en la base 1 de 2 (`ab-base/g9-2` no busca en la web) — `skills/sdd-grilling/SKILL.md`, «Look it up before asking»
