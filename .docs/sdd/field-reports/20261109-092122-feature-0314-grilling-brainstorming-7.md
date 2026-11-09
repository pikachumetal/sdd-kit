---
kit_version: 2.3.4
lane: feature
id: 20261109-092122-feature-0314-grilling-brainstorming-7
task: 0314
mode: full
date: 2026-11-09
---

# Ticket para el kit — feature 0314: el porqué primero en `sdd-grilling`, de brainstorming 7.0.2

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo, Native.
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (como regla de la entrevista), `sdd-rubber-duck`, `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog` y `sdd-feedback`.
- Proyecto: el propio kit. Texto de una skill, batería de sujetos headless, CLI en TypeScript y una persona.
- Modelo del hilo: Opus 5.5.
- Modelos de los subagentes: revisores de spec en opus y sonnet; ejes Spec (opus) y Código (sonnet); re-revisión en opus; sujetos de la batería en sonnet.
- Coste en reloj: 1,73 h frente a 2,5 h estimadas, según el walkthrough, §2.
- Coste en tokens: hilo 52.989.912; subagentes 3.935.247 en 6 despachos. Sesión, 25,32 $; sujetos, 10,13 $ en 47.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `battery.mjs run` sale con 0 sin lanzar ningún sujeto cuando las fases anteriores ya gastaron el `COST_CAP`

- **Qué pasó**:
  - La batería entera de control se lanzó con `COST_CAP=6`, con 5,83 $ ya gastados por las fases anteriores. Corrió 16 de los 19 sujetos y dejó `p1`-`p3` «sin evidencia».
  - La tanda siguiente (REFACTOR 1 y los controles con `develop`) se lanzó con `COST_CAP=2` y no lanzó ninguno: «techo de 2 $ alcanzado (7.22 $ gastados, 0 en curso…)».
  - En los dos casos, `sdd watch command -- node tests/headless/battery.mjs run` terminó con «salió con 0». Me di cuenta al leer el veredicto «sin tools.txt».
  - Es el segundo caso: la 0297 tuvo el mismo fallo con `PHASE=red2` (su walkthrough, §5).
- **Fuente**: los logs de `.temp/sdd/watch/*.log`, que contienen «techo de 6 $ alcanzado (5.83 $ gastados, 2 en curso…)» y «techo de 2 $ alcanzado (7.22 $ gastados…)». También `.docs/sdd/specs/20261108-184606-feature-0314-grilling-brainstorming-7/walkthrough.md`, §5 y «Decisiones tomadas sin el dev-lead».
- **Dónde en el kit**: `tests/headless/campaign.mjs`, el control de `COST_CAP`, y `.docs/sdd/tech-stack.md`, «Baterías por skill». La regla («`COST_CAP` comunes a todas las fases») está escrita ahí.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. El lanzador lo avisa en una línea, entre otras, y sale con un código que la vigilancia lee como éxito.
- **Coste**: una relanzada (2 tandas) y unos 15 min de diagnóstico. Lo respalda el walkthrough, §5.
- **Propuesta**: si el gasto acumulado ya alcanza `COST_CAP` antes de lanzar el primer sujeto de la tanda, que `battery.mjs run` salga con un código distinto de 0 y con «COST_CAP es el techo de toda la campaña de SPEC_DIR: van <x> $ gastados; pásalo como total, no por tanda».
- **Verificada**: sí, reproducido dos veces en esta sesión con `battery.mjs run` en Git Bash (los logs de arriba).
- **Criterio de aceptación**: GIVEN una campaña con 7,22 $ gastados WHEN se lanza `COST_CAP=2 … battery.mjs run` THEN sale con un código distinto de 0 antes de montar ningún molde, y su mensaje dice que el techo es acumulado.

### 2. `sdd-init` y `sdd-propose` no siempre cargan `sdd-grilling`, y sin ella la pregunta sale con la forma equivocada

- **Qué pasó**:
  - En 4 de los 47 sujetos de la campaña, la sesión no invocó `sdd-grilling`: dos `g8` (`sdd-init`) y dos `p3` (`sdd-propose`).
  - Los cuatro fallaron por la forma de la pregunta. `g8` falló R5: «Del README y del código propongo esto:… por ejemplo, alguien que administra las salas». `p3` falló R2: lista numerada con «(Recomendada)» y sin ➡️.
  - Todas las sesiones que la cargaron pasaron esas filas, también con el kit de `develop`.
- **Fuente**: `tests/sdd-grilling-0314-green.md`, tabla «R5 en `g8`»; `tests/sdd-grilling-0314-red.md`, filas `p3-1` y `p3-2`; los `tools.txt` de `control/`, `post/`, `red/` y `red2/` de la carpeta de la spec.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 4 («The interview's questions follow `sdd-grilling` (invoke it with `Skill`)»), y el paso equivalente de `skills/sdd-init/SKILL.md`. Es la fila de deuda «La invocación de `sdd-grilling` no carga siempre», del GREEN de la 0128.
- **Por qué el kit no lo evitó**: la invocación es una frase dentro del paso, y bajo carga el agente pregunta sin abrirla.
- **Coste**: un Important falso en la revisión final (el de `g8` como «rojo nuevo»), que costó 2 sujetos más (0,24 $) y una pasada de análisis. Lo respaldan el walkthrough, §4.3, y `tasks.md`, `## Rulings`.
- **Propuesta**: segundo caso de la fila de deuda existente. Sin solución nueva propuesta aquí.
- **Verificada**: sí, contrastado sujeto a sujeto en los `tools.txt` citados.
- **Criterio de aceptación**: GIVEN `g8` y `p3` con n = 4 WHEN `sdd-init` o `sdd-propose` llegan a su primera pregunta THEN `tools.txt` muestra `sdd-kit:sdd-grilling` en los 4.

### 3. La regla «RED limpio a n = 3 sale con un ruling» obliga a parar cuando la spec aprobada fija n = 2 y ya dice que lo limpio sale con una enmienda

- **Qué pasó**:
  - La spec aprobada decía que una sustitución con 0 fallos a n = 2 no entraba, y que su requisito salía del delta «con una enmienda».
  - `sdd-implement` exige n = 3 para que un RED limpio salga con un ruling; con otra n, es un desvío y hay que parar.
  - Paré y el dev-lead aprobó «1». La parada sirvió por otro motivo: la decisión 11 de la spec era falsa.
- **Fuente**: `dist/skills/sdd-implement/SKILL.md:61` («A Scope item marked «si el RED lo exhibe» with a clean RED at n = 3 goes out with a `Ruling:`; anything else is a deviation»); `spec.md`, decisión 14 y «Enmiendas».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings», viñeta «Deviation».
- **Por qué el kit no lo evitó**: la regla fija la n y no mira la n que aprobó la spec.
- **Coste**: una parada del dev-lead. La respalda `spec.md`, «Enmiendas», 2026-11-08.
- **Propuesta**: que salga con un ruling el RED limpio a la n que fija la spec aprobada, cuando la spec dice qué pasa con lo limpio. Con n < 3 sin esa frase en la spec, seguiría siendo un desvío.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec aprobada con «n = 2; con 0 fallos, su requisito sale con una enmienda» y un RED 0 de 2 WHEN el hilo lo lee THEN sigue con un `Ruling:` y la enmienda, sin parar.

### 4. Un antiobjetivo inventado en «Lo que entendí», dos veces

- **Qué pasó**: con el kit de `develop` y con el de la rama, un sujeto de cada tanda escribió en la nota de entendimiento un fracaso que el dev no había dicho. RED `p2-2`: «Lo que daría el trabajo por fallido… es que la hoja lo abra mal». GREEN `p3-2`: «Un fallo sería que Excel no abra las columnas separadas».
- **Fuente**: `tests/sdd-grilling-0314-red.md` y `tests/sdd-grilling-0314-green.md`, fila W5.
- **Dónde en el kit**: `skills/sdd-propose/references/spec-writing.md`, «What the spec covers» («what you guess goes to ✋»).
- **Por qué el kit no lo evitó**: la regla dice adónde va lo supuesto en la spec, pero no en la nota de entendimiento, que se presenta como «lo que entendí».
- **Coste**: ninguno en esta feature, porque es la línea base de W5 en los dos kits. Dos casos.
- **Propuesta**: candidata a fila. Que la nota de entendimiento separe lo que dijo el dev de lo que supone el agente, o que no traiga antiobjetivos.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `p2` y `p3` con n = 4 WHEN el agente escribe su nota de entendimiento THEN ningún antiobjetivo sin decir sale como entendido.

### 5. El aviso «kit 2.3.4 frente a 3.0.0» de los moldes tumba `g7` en todas las campañas

- **Qué pasó**: `g7` (`sdd-config`) se para en el aviso de versión del hook de arranque y pide actualizar el plugin. Da rojo de puerta con la rama y con `develop`. Otros sujetos (`p1-2`, `p2-2`, `p3-2`) copian el mismo aviso en su respuesta.
- **Fuente**: `control/out/g7-1.texts.txt` y `control-dev/out/g7-1.texts.txt`, «En una terminal normal, ejecuta `claude plugin update sdd-kit@sdd-kit --scope project`».
- **Dónde en el kit**: el marcador de kit de `tests/batteries/sdd-grilling/subject.mjs` (`SALAS_MARKER`) y el aviso de versión del hook de arranque. No lo localicé más fino.
- **Por qué el kit no lo evitó**: el marcador del molde no lleva la versión que pide el aviso.
- **Coste**: `g7` deja de vigilar R10 y C1 (las filas de `sdd-config`) en cada campaña. Cada control con `develop` le dedica un sujeto (unos 0,25 $).
- **Propuesta**: que el marcador del molde declare la versión del kit del `KIT_DIR` que se lanza.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `g7` con el kit de `develop` WHEN arranca THEN no hay aviso de versión y la primera skill es `sdd-kit:sdd-config`.

### 6. La frase del cambio de método tras una compactación se activa sola si el plan se escribe después de compactar

- **Qué pasó**: la sesión se compactó en la spec, y el plan se escribió después. La línea `Ejecución` lleva literal «Si esta sesión se retomó tras una compactación… y quedan dos o más tasks… invoca `sdd-implement-subagent`», y su condición ya se cumplía al escribirla. Lo resolví con un ruling (decisión 2 del plan) para seguir en Native.
- **Fuente**: `plan.md`, decisión 2 y línea `Ejecución`.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`, línea `Ejecución`, y `skills/sdd-implement/SKILL.md`, «Method».
- **Por qué el kit no lo evitó**: la condición mira el arranque de la sesión, no si la compactación fue anterior al plan.
- **Coste**: un ruling; sin coste medido.
- **Propuesta**: que la condición sea «se compactó después de escribir este plan».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una sesión compactada antes de escribir el plan WHEN `sdd-implement` lee la línea `Ejecución` THEN sigue en Native sin ruling.

## Lo que hice por iniciativa propia

- Crucé cada fila roja de la rúbrica con el `tools.txt` del sujeto, para ver si cargó la skill medida. Separó el rojo de `g8` (la skill no se cargó) de una regresión. Funcionó, y es candidato a regla del método de baterías: una fila de conducta de la skill X se lee con «¿cargó X?» al lado.
- Leí W3 también en 25 salidas guardadas de campañas anteriores, sin lanzar sujetos. Bajó el coste del RED de la (3) a 0 $.

## Funcionó, no tocar

- Probar el delta con `sdd capability merge` sobre una copia cazó que, al quitar la línea `REMOVED`, el MODIFIED perdía un AND vigente.
- La parada por el RED limpio sacó a la luz que la fila del molde chocaba con un hecho («desde hoy» sobre reservas sin fecha).
- La re-revisión única cerró los 11 hallazgos en una pasada.

## Menores

- `npx vitest` en `cli/` del worktree: MODULE_NOT_FOUND otra vez; uso `pnpm exec vitest`, como la 0297. Es la «Verificación» de `plan-template.md`, que da `npx` como ejemplo.
