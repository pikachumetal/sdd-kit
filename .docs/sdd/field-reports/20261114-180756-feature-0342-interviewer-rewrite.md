---
kit_version: 3.0.0
lane: feature
id: 20261114-180756-feature-0342-interviewer-rewrite
task: 0342
mode: full
date: 2026-11-14
---

# Ticket para el kit — feature 0342: reescribir el entrevistador del kit perdió reglas medidas y acabó en el núcleo de antes aligerado

## Contexto

- Carril y modo: feature full, perfil delegate, validación en campo
- Skills del kit usadas: sdd-propose, sdd-grilling, sdd-parallel-agents, sdd-implement, sdd-implement-native, sdd-worktrees, sdd-tdd, sdd-agent-writing, sdd-verify, sdd-archive, sdd-retro, sdd-feedback
- Proyecto: el repo del kit (skills en Markdown, CLI en Node, baterías headless de sujetos)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (lectores, revisores de la spec, eje Código), Opus 5.5 (eje Spec, re-revisión); sujetos Sonnet 5.5 y la persona de un escenario en Haiku 5.5
- Coste en reloj: 4,54 h frente a 5 h estimadas
- Coste en tokens: hilo 185.280.619, subagentes 24.644.117 en 35 despachos; sesión 71,88 $ y sujetos 63,50 $ en 259

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Reescribir de cero una skill medida perdió reglas probadas, y la review de la spec lo vio y lo rechacé

- **Qué pasó**: la spec mandaba escribir el núcleo de `sdd-grilling` de cero, con las piezas de un spike sustituyendo frases. El GREEN no salió en verde tras dos rondas de REFACTOR: el rechazo perdió «sin opciones ni recomendación» (R9), el boceto perdió su contraejemplo (B1) y una pieza nueva, la pregunta abierta «que pide un caso», salía como pregunta doble (E5). El revisor de dominio de la spec señaló el Art. IX («quitar una frase sin sustituirla exige un A/B»), y lo rechacé argumentando que las frases se sustituían pieza a pieza. La feature acabó volviendo al núcleo de antes con solo las tres piezas que midieron igual o mejor.
- **Fuente**: `walkthrough.md` §3 de la feature 0342; `spec.md`, «Hallazgos de la review», línea «Rechazado — el Art. IX exige un A/B»; `green-2/totales.md` y `green-3/totales.md` de la carpeta de la feature.
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md` §4 (cómo se pliegan los hallazgos) y `skills/sdd-agent-writing/SKILL.md` (al editar una skill existente).
- **Por qué el kit no lo evitó**: la regla existía (constitution, Art. IX: «parte de su fuente sin tocar lo que funciona») y no la apliqué; nada me obligaba a listar, frase a frase, qué reglas medidas se quedaban literales al reescribir.
- **Coste**: dos rondas de REFACTOR y el GREEN de la ronda 2, 22,54 $ de sujetos (`walkthrough.md` §2), más dos paradas al dev-lead.
- **Propuesta**: una spec que reescribe una skill con tabla de procedencia en su batería lleva una tabla «regla medida → se queda literal | sustituida por <pieza con su RED> | sale con A/B»; un hallazgo de review que cita el Art. IX no se rechaza sin esa tabla.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una petición «reescribe de cero el núcleo de una skill con batería»; WHEN el agente escribe la spec; THEN la spec lleva una fila por regla de la tabla de procedencia de la batería, y ninguna sale sin A/B o sin pieza que la sustituya.

### 2. Una regla que bajó a otro fichero se parafraseó y perdió su contraejemplo

- **Qué pasó**: la frase del porqué («ask that first, even if you can guess: open, «what will you do with it?», not «a spreadsheet, a colleague, a backup?»») bajó del núcleo a `spec-writing.md` parafraseada como «first what they want it for, open». Dos escenarios lo pagaron: uno preguntó el para qué con un menú («¿…a una hoja de cálculo, a otro script o a otra cosa?») y otro dio el porqué por hecho. Con la frase literal, los dos escenarios pasaron.
- **Fuente**: `green-3/totales.md` (E6 de `p1` 1/2, E0 de `g3` 0/1) y `green-4/totales.md` (los dos en verde) de la carpeta de la feature 0342; commit `803ef82`.
- **Dónde en el kit**: `skills/sdd-agent-writing/SKILL.md`, «Pruning» (single source of truth) y «Information hierarchy».
- **Por qué el kit no lo evitó**: la skill dice dónde va cada pieza, no que una regla que cambia de fichero viaje literal con sus ejemplos y contraejemplos.
- **Coste**: 6,73 $ de sujetos y una parada al dev-lead (`walkthrough.md` §2 y §3).
- **Propuesta**: en `sdd-agent-writing`, «Una regla que cambia de fichero va literal, con su contraejemplo; reescribirla es otra regla y pide su RED».
- **Verificada**: sí — contrastado con `green-3/totales.md` frente a `green-4/totales.md`.
- **Criterio de aceptación**: GIVEN una spec que mueve una frase con contraejemplo de una skill a otra; WHEN el agente la mueve; THEN el `git diff` muestra la frase igual en su destino.

### 3. Un ejemplo de la skill en el dominio de un escenario se copiaba

- **Qué pasó**: el ejemplo de pregunta abierta del núcleo era «¿qué harás con el CSV el próximo lunes?», del mismo dominio que tres escenarios. En la ronda 1, E3 de un escenario cayó a 0/5: los sujetos copiaban el ejemplo aunque la petición ya lo contestaba. Con un ejemplo neutro volvió a su nivel.
- **Fuente**: `refactor-1/totales.md` (E3 de `pe` 0/5) y `green-2/totales.md` (3/5) de la carpeta de la feature 0342.
- **Dónde en el kit**: `skills/sdd-agent-writing/SKILL.md`, «Leading words» o «Pruning».
- **Por qué el kit no lo evitó**: ninguna regla dice en qué dominio va un ejemplo de una skill.
- **Coste**: parte de la ronda 1, 8,77 $ de sujetos (`walkthrough.md` §2); causa respaldada por `refactor-1/totales.md`.
- **Propuesta**: «Los ejemplos de una skill van en un dominio que ninguna batería use» (ya escrito en `operations.md` del repo, «Baterías por skill»).
- **Verificada**: sí — contrastado con `refactor-1/totales.md` frente a `green-2/totales.md`.
- **Criterio de aceptación**: GIVEN un ejemplo del mismo dominio que un escenario; WHEN corre su batería; THEN su fila de «no preguntes lo que ya dice la petición» no baja frente al texto sin el ejemplo.

### 4. `sdd-propose` rebate la premisa antes de cargar el entrevistador

- **Qué pasó**: en el escenario donde el usuario pide algo que ya existe, el turno 1 (el rebate) salió siempre sin `sdd-grilling`: el núcleo se carga en el turno 2. Además, cada tanda tuvo 1–4 sujetos de `sdd-propose` o `sdd-init` que no cargaron el núcleo y lo cargaron al relanzar.
- **Fuente**: `refactor-1/readings/fp.md` (carga en el turno 2) y `green-4/totales.md`, última línea, de la carpeta de la feature 0342.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` pasos 2 y 4.
- **Por qué el kit no lo evitó**: el paso 4 manda cargar `sdd-grilling` «before the interview's first question», pero el rebate ocurre al clasificar, en el paso 2.
- **Coste**: 10 relanzamientos (~2,5 $, sin respaldo exacto: la suma sale de las líneas de coste de cada tanda en `walkthrough.md` §2).
- **Propuesta**: que el paso 2 cargue `sdd-grilling` antes de cualquier pregunta al usuario, también un rebate.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN el escenario `fp` de la batería del entrevistador; WHEN corre a n = 5; THEN la carga del núcleo precede al mensaje del turno 1 en 5 de 5.

### 5. Apliqué mal mi propio criterio de cierre y lo cazó el eje Spec

- **Qué pasó**: la enmienda fijaba «una fila que no llega se compara con el núcleo de antes; peor, es rojo». En los totales di por iguales tres filas peores por un sujeto. El eje Spec de la revisión final lo cazó y hubo que parar otra vez al dev-lead.
- **Fuente**: `spec.md`, tercera enmienda del 2026-11-14; `green-4/totales.md` de la carpeta de la feature 0342.
- **Dónde en el kit**: no localizado: ninguna plantilla da la forma de una tabla «fila · base · ahora · veredicto».
- **Por qué el kit no lo evitó**: el veredicto por fila lo escribí a mano.
- **Coste**: una parada y un control de 0,09 $ (`walkthrough.md` §2).
- **Propuesta**: una herramienta que compare dos lecturas por fila y escriba la tasa de cada una, para que el veredicto no salga a ojo.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN dos carpetas de lecturas; WHEN corre la comparación; THEN cada fila sale con las dos tasas y «peor» cuando la de ahora es menor.

### 6. El precio de plan de las baterías se quedó corto y la tanda cortó en el techo

- **Qué pasó**: el GREEN del núcleo aligerado gastó 15,30 $ frente a los 13,86 $ de su previsión; con `COST_CAP=58`, `battery.mjs` dejó tres sujetos sin lanzar. Además, `run.mjs` avisó en cada tanda «sin previsión legible … escribe el total en la fila Suma, columna de sujetos», y hubo que pasar `SUBJECT_CAP` a mano.
- **Fuente**: `walkthrough.md` §2 de la feature 0342 (coste de cada tanda) y la previsión de su `spec.md`; aviso de `tests/headless/run.mjs` en la salida de cada tanda.
- **Dónde en el kit**: `tests/headless/battery.mjs` (`plan`) y `tests/headless/run.mjs` (lectura de la fila «Suma»).
- **Por qué el kit no lo evitó**: el precio de plan sale de campañas viejas, y la fila «Suma» que espera `run.mjs` no casa con la previsión que pide la plantilla.
- **Coste**: un relanzamiento parcial y una parada para subir el techo.
- **Propuesta**: que `plan` use la media de las últimas campañas de cada escenario, y que `run.mjs` lea la fila «Suma» de la previsión de la plantilla.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec con la previsión de la plantilla; WHEN se lanza una tanda; THEN `run.mjs` no avisa «sin previsión legible».

## Lo que hice por iniciativa propia

- Controles con el núcleo de antes en los escenarios dudosos (`g7`, `sk`, `n4`) para separar regresión de ruido: sacaron una regresión real (C1) y dos de ruido (B1, S2). Funcionó.
- Un script de recuento de lecturas por escenario y fila. Funcionó; es el germen del hallazgo 5.
- Un test que rechaza dos viñetas fundidas en una línea de una skill, tras fundirlas dos veces con un `Edit` que quitaba la última frase de una viñeta (lo cazaron los dos ejes de la revisión final). Funcionó: RED con el texto viejo, GREEN con el arreglado.

## Funcionó, no tocar

- La fila K por llamada y el transcript sin cortar: separaron la carga entera de una mención en todas las tandas.
- Las paradas del perfil delegate: pararon donde había que decidir (dos desvíos y el dinero), sin preguntas intermedias.
- Probar el delta en una copia con `sdd capability merge` antes de cada enmienda.

## Menores

- `npx vitest run` falla en Git Bash con `Cannot find module …\vitest\vitest.mjs`; `pnpm exec vitest run` funciona, como ya dice `operations.md` — no localizado en el kit.
- `sdd task start` se negó sin `tasks.md` y lo pidió; correcto, pero el plan no lo nombraba — `skills/sdd-implement/SKILL.md`, «Before each task».
