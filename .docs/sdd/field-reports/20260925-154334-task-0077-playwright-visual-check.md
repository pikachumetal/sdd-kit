---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: task
id: 20260925-154334-task-0077-playwright-visual-check
task: 0077
mode: full
date: 2026-09-25
---

# Ticket para el kit — task 0077: verificación visual con Playwright y variante de gama media al delegar

## Contexto

- Carril y modo: task full, perfil `delegate`, spec aprobada por delegación en la primera pregunta
- Skills del kit usadas: `sdd-start-task`, `sdd-end-task`, `add-to-changelog`, `sdd-feedback`, `sdd-templates` (plantillas y scripts)
- Proyecto: el propio kit (skills en Markdown, scripts PowerShell con Pester, lanzador bash de sujetos headless), una persona
- Modelo del hilo: Fable 5.1 al arrancar, Opus 5.5 desde la primera pregunta
- Modelos de los subagentes: revisor final Opus con `sdd-kit:effort-high`; 25 sujetos headless Sonnet y Opus
- Coste en reloj: ~1,8 h (spec y plan con RED ~0,8 h, implementación y cierre ~1 h)
- Coste en tokens: hilo 30.597.074, subagentes 2.923.266; sujetos 11,70 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un agente que levanta la aplicación la para matando todos los procesos de node de la máquina

- **Qué pasó**: 3 de 25 sujetos pararon su servidor de prueba con `taskkill //F //IM node.exe` (uno del RED, dos del GREEN). Uno lo dijo en su mensaje: «maté todos los `node.exe` de la máquina». En la sesión que lanzaba la campaña se desconectó a la vez el MCP de Playwright, que corre sobre node.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6, frase de la «Verificación visual». Desde esta task pide levantar la aplicación más a menudo, y no dice cómo pararla.
- **Por qué el kit no lo evitó**: ninguna skill habla de parar lo que el agente arranca. La mission lo menciona para `delegate` («para los procesos que arrancó») sin decir cómo.
- **Coste**: en un proyecto real mata el servidor de desarrollo del dev-lead, otros MCP y otras sesiones de agente. Aquí tumbó una herramienta de la sesión principal.
- **Propuesta**: en el paso 6, «para lo que arrancaste por su PID o por el puerto que escucha, nunca por el nombre del ejecutable», con una fila en la tabla de racionalizaciones.
- **Criterio de aceptación**: GIVEN el molde web de la 0077 (`red/subject.sh`, escenarios `v6` y `v7`) · WHEN el sujeto termina su verificación visual · THEN ninguna tool call contiene `taskkill` con `/IM` ni `pkill node` ni `killall node`. Hoy: 3 de 25.

### 2. `run.sh` acepta un `SPEC_DIR` relativo y pierde las salidas sin error

- **Qué pasó**: la primera tanda del RED se lanzó con `SPEC_DIR` relativo. `subject_launch` cambia al molde, las salidas se escriben contra una ruta que ya no existe y `run.sh` termina con «sujetos de la campaña: 0 · coste acumulado: 0.00 $» y exit 0. Se recuperaron con `extract.mjs` desde los `.jsonl` del scratchpad.
- **Dónde en el kit**: `tests/headless/run.sh` (el lanzador de referencia del repo; no se distribuye a proyectos).
- **Por qué el kit no lo evitó**: el lanzador comprueba que `RUNS_DIR` está en el scratchpad, pero no que `SPEC_DIR` sea absoluto.
- **Coste**: una tanda que parecía no haber corrido. Además, el techo de sujetos y de coste cuenta sobre esas salidas, así que sin ellas deja de vigilar.
- **Propuesta**: `run.sh` resuelve `SPEC_DIR` a ruta absoluta al arrancar. Ya tiene fila de deuda en el roadmap.
- **Criterio de aceptación**: GIVEN `SPEC_DIR=.docs/sdd/specs/<carpeta>` relativo y `DRY_RUN=1` · WHEN se lanza `run.sh` · THEN `<carpeta>/red/out/a-1.tools.txt` existe y el recuento final dice 1 sujeto. Caso nuevo en `tests/HeadlessLauncher.Tests.ps1`.

### 3. Una excepción que depende de un predicado choca con otro predicado del mismo paso

- **Qué pasó**: la variante de gama media no se ofrece «con una sola task prevista». El escenario del GREEN para esa excepción (`q1`) usó una fila de una task, y los dos sujetos la clasificaron como lite, donde no hay plan. El 2/2 no probaba la excepción. Lo vio la revisión final, y hubo que añadir `q2`, con una task que no cabe en lite.
- **Dónde en el kit**: Art. II de la constitution («una excepción de la guía lleva su contraejemplo… y el GREEN tiene un escenario en el que esa excepción es la salida fácil») y `tests/` como método. No es un fallo de una skill.
- **Por qué el kit no lo evitó**: la comprobación previa de cada escenario (`tech-stack.md`, «Comprobación previa…», task 0008) no pregunta si otro predicado del mismo paso, como lite, patch o partir la task, desvía al sujeto antes de llegar a la excepción.
- **Coste**: un sujeto de control más y una ronda de la revisión final.
- **Propuesta**: una pregunta más en esa comprobación previa: «¿el escenario de la excepción cumple o incumple otro predicado del mismo paso que cambie qué se mide?».
- **Criterio de aceptación**: GIVEN una guía nueva con una excepción en el paso 2 de `sdd-start-task` · WHEN el autor de la campaña diseña el escenario de la excepción · THEN su molde fija los otros predicados del paso (lite, patch, partir) en el valor que deja la excepción a la vista.

## Lo que hice por iniciativa propia

- **Un puerto aleatorio por sujeto en el molde web.** Evitó que se pisaran los sujetos node; en el molde .NET, con el puerto fijo, dos sujetos en paralelo sí se pisaron. Funcionó.
- **Reencuadrar la spec con el RED antes de la aprobación delegada.** Salieron la receta en un fichero auxiliar y la pasada final de `delegate`, porque 4 de 4 sujetos ya lo cumplían. Con la spec delegada no hubo gate que lo exigiera; lo pide el Art. I.
- **Cerrar los arreglos de la revisión final dentro de la previsión**: un sujeto de control por escenario afectado en vez de dos, para no pasar de 25. Funcionó, pero deja esos dos arreglos con n=1.

## Funcionó, no tocar

- La primera pregunta con la opción de delegar la spec: el dev-lead la eligió y la task corrió sin paradas hasta la validación.
- El lanzador de referencia con `SUBJECT_CAP` y `COST_CAP`: la campaña cerró en 25 de 25 sujetos, con el techo a la vista en cada tanda.
- La regla del disparador concretado cuando la validación diferida lo deja vago («prueba diferida al uso»): no hubo que repreguntar.
- La revisión final con Opus y effort high: encontró la contradicción entre el paso 2 nuevo y el paso 4, que ningún test de literales podía ver.

## Errores míos, no huecos del kit

- El primer molde .NET no implementaba la spec, y los dos sujetos pararon por eso: 0,57 $ perdidos.
- Sumé los totales de coste sobre cifras redondeadas; lo vio la revisión final.
- La variante del paso 2 remitía al paso 4 sin comprobar que el paso 4 solo para con Native.
