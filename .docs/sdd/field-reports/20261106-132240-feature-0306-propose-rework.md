---
kit_version: 2.3.4
lane: feature
id: 20261106-132240-feature-0306-propose-rework
task: 0306
mode: full
date: 2026-11-06
---

# Ticket para el kit — feature 0306: `sdd-propose` rehecha por debajo de 20.000 bytes, con la review de spec siempre

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, baterías headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (revisor de dominio, eje Spec, re-revisión), Sonnet 5.5 (revisor técnico, eje Código, segundas rondas, lectores de prosa); sujetos Sonnet
- Coste en reloj: 16,05 h frente a 4 h estimadas (el reloj incluye el corte de la sesión de la noche, que `sdd session tokens` no cuenta como hueco)
- Coste en tokens: hilo 152.871.559, subagentes 40.922.304 en 14 despachos; sesión 64,38 $, sujetos 107,44 $ en 171

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La previsión de sujetos se quedó a la mitad: el precio por sujeto venía de otra campaña

- **Qué pasó**: la spec preveía los controles a 0,36 $ por sujeto (~99 sujetos, 38,14 $; total 57,50 $). La batería entera salió a ~0,67 $ por sujeto (71,43 $ en 107), y los escenarios largos a ~1 $ (10,11 $ en 10). Además, al pedir la decisión conté «~78 sujetos» sin leer las columnas `n` de la tabla, y eran 107. El dev-lead tuvo que decidir dinero tres veces en la Task 5.
- **Fuente**: `.docs/sdd/specs/20261105-161645-feature-0306-propose-rework/spec.md`, fila «Controles» y «Suma» de «Previsión de coste»; el log del lanzador (`control: 107 sujetos · 71.43 $`, `refactor-l: 10 sujetos · 10.11 $`, `sujetos de la campaña: 171 · coste acumulado: 107.44 $`); `walkthrough.md` §2 y §3.
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, hueco «Previsión de coste»; `tests/headless/battery.mjs` y `campaign.mjs`, que ya conocen `n` y los costes de cada campaña guardada.
- **Por qué el kit no lo evitó**: el precio por sujeto sale de un número escrito a mano (`tech-stack.md`, o la última campaña que alguien recuerde), y el recuento de sujetos, de contar escenarios en vez de sumar `n`. Nada calcula la previsión desde la tabla de la batería.
- **Coste**: 49,94 $ por encima de la previsión y tres paradas del dev-lead por dinero (ledger de la Task 5, en `tasks.md`, «Rulings»).
- **Propuesta**: `battery.mjs plan` imprime, para un `SCENARIOS` dado, los sujetos (suma de `n`) y el coste previsto con el precio medio de las campañas guardadas de esa batería; la previsión de la spec cita esa salida.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN la batería de `sdd-propose` con campañas guardadas WHEN `battery.mjs plan` con 58 escenarios THEN imprime 107 sujetos y un coste dentro del ±20 % de los 71,43 $ medidos.

### 2. Traducir una reference compartida cambió sus anclas y la feature tocó cinco skills de otras filas abiertas

- **Qué pasó**: traducir `control-profiles.md` cambió los títulos y con ellos las anclas (`#vigía-de-silencio` → `#silence-watch`, `#validación-en-campo` → `#field-validation`). Arreglar los enlaces llevó la feature a `sdd-archive`, `sdd-implement`, `sdd-verify`, `sdd-config` y `CLAUDE.md`, mientras la 0296, la 0305 y la 0307 reescribían esos mismos párrafos. La fila del roadmap decía «Ficheros: `skills/sdd-propose/`». El `sdd merge --sync` dio conflicto en 12 ficheros, y el dev-lead preguntó «se suponia que cada tarea tocaba un skill, que ha pasad?».
- **Fuente**: `git log` del merge `25fab9b4` (las seis líneas «Conflicto de la base resuelto por el agente»); decisión 10 de la spec, con los siete sitios; fila 0306 de `.docs/sdd/roadmap.md`.
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md` (lo que se retira o cambia de forma, sin mirar las filas abiertas que tocan esos ficheros); la regla de anclas no existe.
- **Por qué el kit no lo evitó**: la decisión 10 encontró los siete sitios, pero nada la contrastó con los ficheros de las otras filas abiertas, y nada dice que una traducción conserve el ancla.
- **Coste**: ~20 min de resolver los conflictos a mano, una parada del dev-lead y un commit de merge «sin revisar» (`25fab9b4`).
- **Propuesta**: al traducir o renombrar un título que otra skill enlaza, conservar el ancla con un `<a id="<ancla vieja>"></a>` antes del título y no tocar los enlaces de fuera; el repaso de coherencia lista, por cada fichero fuera del Scope de la fila, las otras filas abiertas que lo nombran (lo que hará la 0319).
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que traduce `control-profiles.md` WHEN se hace el repaso de coherencia THEN el Scope no lista ningún fichero de otra skill para cambiar un enlace, y `git grep` de las anclas viejas en `skills/` sigue resolviendo.

### 3. Un REFACTOR quitó del `SKILL.md`, con un ruling, cinco textos que la spec decía que se quedaban

- **Qué pasó**: para que el `SKILL.md` cupiera en 20.000 bytes, la segunda tanda de REFACTOR quitó la racionalización «Try it quickly» y dos red flags (y, sin apuntarlas, otras dos racionalizaciones), con un ruling en el ledger y sin parar. La decisión 17 de la spec aprobada decía «las demás se quedan». Lo vio el eje Spec de la revisión final (M3). La review de la enmienda encontró un Crítico: una de ellas contestaba a un argumento que nada más rebate.
- **Fuente**: `tasks.md`, «Rulings», `Task 4: Ruling: REFACTOR 2 de los enfoques`; spec, decisión 17 y «Hallazgos de la review de la enmienda del 2026-11-06».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings»; ya hay una fila de deuda abierta, «Un freno que fija la spec se esquiva con un ruling», con tres casos.
- **Por qué el kit no lo evitó**: la regla existía (cambiar la spec aprobada es un desvío), y la apliqué como ruling porque el texto quitado «repetía» otras frases. Cuarto caso de esa fila.
- **Coste**: una enmienda con dos revisores y segunda ronda, y una parada del dev-lead.
- **Propuesta**: un ruling que quita un texto que la spec nombra para quedarse es un desvío por definición; `sdd ledger rulings` avisa de un ruling cuyo texto contiene «quit» o «sale» junto a un literal citado en la spec.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que dice que la red flag X se queda WHEN un REFACTOR la quita THEN el agente para como en un desvío antes de commitear.

### 4. Mover bloques a `references/` perdió una regla viva, y solo la vio la revisión final

- **Qué pasó**: al bajar el `SKILL.md` de 33.332 a menos de 20.000 bytes, se perdió la frase «If they choose it, approve the spec, write the plan, put the opening in its commit and stop before Task 1 whatever the method…», que contradice un requisito vivo de `control-profiles`. La batería entera no la vio: ningún escenario mide la consecuencia. La encontró el eje Spec (I1).
- **Fuente**: informe del eje Spec, I1; `git grep "whatever the method" -- skills` vacío en `99eedb9a`.
- **Dónde en el kit**: `skills/sdd-agent-writing/` (cómo se adelgaza una skill); `kit:copies` mide lo que se conserva de una fuente externa, no de la propia skill.
- **Por qué el kit no lo evitó**: nada compara las frases que salen del `SKILL.md` con las que entran en sus `references/`.
- **Coste**: un Important en la revisión final y su arreglo; sin él, la variante de gama media dejaba la apertura sin commit.
- **Propuesta**: un `kit:moved` que, entre la base y `HEAD`, lista cada frase que sale de `skills/<skill>/SKILL.md` sin aparecer en ningún fichero de `skills/`; cada línea se justifica en la spec o vuelve.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `develop..99eedb9a` WHEN se corre `kit:moved` THEN lista la frase «…whatever the method…» y las cinco racionalizaciones y red flags del hallazgo 3.

### 5. Con las references en inglés, el sujeto escribe al usuario líneas en inglés

- **Qué pasó**: 7 de 160 sujetos de control soltaron líneas de transición en inglés («Dispatching the two spec reviewers in parallel…»). En las campañas desde el 31 de octubre, 0 de ~700. Una sustitución de la frase de idioma del Overview («…and the one-line notes between tool calls included, also while the reference you follow is in English») dio 10/10 sin inglés.
- **Fuente**: `tests/sdd-propose-0306-green.md`, «Controles» y «REFACTOR del idioma»; `texts.txt` de `control/` y `refactor-l/`.
- **Dónde en el kit**: la frase «Write everything the user reads in the language of their message…» de 13 `SKILL.md` (`kit:own` la da repetida).
- **Por qué el kit no lo evitó**: la frase no nombra las notas entre llamadas, y las references en inglés las arrastran.
- **Coste**: un REFACTOR, 10 sujetos, 10,11 $.
- **Propuesta**: la frase sustituida, una sola vez, en `includes/`, para las 13 skills (0311).
- **Verificada**: sí — `refactor-l/` 10/10 sin líneas en inglés en `sdd-propose`; sin verificar en las demás.
- **Criterio de aceptación**: GIVEN una skill con references en inglés WHEN un sujeto la sigue en castellano THEN ninguna línea de `texts.txt` empieza por una frase en inglés.

### 6. El lanzador de baterías: no reanuda una tanda cortada y da rojo a una petición slash

- **Qué pasó**: (a) al cerrarse la sesión se cortó la tanda con 35 sujetos guardados; `battery.mjs run` rechaza las etiquetas guardadas («ya existe a1-1 en …: borra esa carpeta o cambia PHASE»), y reanudar pidió un lanzador del scratchpad que llama a `runCampaign`, que sí las salta. (b) `c1` salió 0/2 porque `firstSkill` busca `>>> Skill:` y la petición `/sdd-kit:sdd-propose` carga la skill sin esa llamada; la fila de prosa C1 pasaba 2/2.
- **Fuente**: `tests/headless/battery.mjs`, `refuseSavedLabels` y `firstSkill`; `control/out/c1-1.tools.txt` (la primera línea `>>> Skill:` es `sdd-kit:sdd-grilling`).
- **Dónde en el kit**: `tests/headless/battery.mjs`.
- **Por qué el kit no lo evitó**: no hay modo de reanudar, y el veredicto supone que la skill entra por `Skill`.
- **Coste**: ~15 min de lanzador a mano y de leer un rojo falso; los 5 sujetos en curso al cortar se pagaron sin resultado.
- **Propuesta**: `battery.mjs run --resume` que salte las etiquetas con `tools.txt` y RESULTADO; y que `firstSkill` cuente como primera la del slash de la petición (`state.txt`, «## petición»).
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `control/out/` con `c1-1` y `c1-2` WHEN `battery.mjs verdict` THEN `c1` sale 2/2; GIVEN una tanda con 35 etiquetas guardadas WHEN `run --resume` THEN lanza solo las otras 72.

## Lo que hice por iniciativa propia

- Las filas de prosa de 107 sujetos las leyeron tres agentes Sonnet (effort medium), un tercio cada uno, con cada «falla» releída en el hilo: ~4 $ y sin cargar el contexto del hilo. Funcionó; dos de sus «falla» eran falsos (CO6, con el precedente de la 0281).
- Para atribuir el rojo del idioma, conté las líneas en inglés en las campañas previas (0 de ~700): convirtió un «quizá» en un rojo de esta feature.
- Antes de gastar sujetos, comprobé las fixtures rehechas con `sdd capability merge` sobre una copia del molde.

## Funcionó, no tocar

- La revisión final en ejes: el eje Spec encontró una regla perdida (I1) y el desvío de la decisión 17, que la batería entera no veía.
- Dos revisores y segunda ronda sobre cada enmienda: la del 2026-11-06 tuvo un Crítico en cada ronda, y los dos cambiaron el texto.
- El repaso de coherencia nuevo (`git grep` y `capability merge` sobre copia) paró a los sujetos de `rv2` y `lr1` ante fixtures incoherentes, que es lo correcto.

## Menores

- En PowerShell, un patrón de `-like` con una tilde invertida (`` `RUNS_DIR` ``) la toma por escape y duplicó una línea al resolver un conflicto — no localizado.
- Un script de Node que parte por `'\n'` no casa `=======` en un fichero CRLF y el bucle no terminó — no localizado.
- El cierre escribió en `.docs/sdd/tech-stack.md` («Entrega de la skill al sujeto») y en el walkthrough «~0,57 $ de media… (71,43 $ en 107)»: la división da ~0,67 $; los 0,57 $ venían de una cuenta parcial a mitad de la tanda. Hay que corregir la cifra en `tech-stack.md` y poner una adenda en el walkthrough — no localizado
- `sdd session tokens` no cuenta como hueco el corte de la sesión de la noche (~11 h dentro del reloj) — `cli/` de `session tokens`.
