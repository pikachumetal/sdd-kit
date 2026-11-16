---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261021-130452-feature-0223-cifra-suelta-ppt
task: 0223
mode: full
date: 2026-10-21
---

<!-- cspell:ignore quítalas remerge -->

# Ticket para el kit — feature 0223: la verificación E2E del cierre costó una mañana

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: `sdd-end-feature`, `sdd-templates` (`Merge-CapabilityDelta.ps1`, `Test-Capabilities.ps1`,
  `Test-Roadmap.ps1`, `Build-EstimationLog.ps1`, `Measure-SessionTokens.ps1`, `Invoke-SddMerge.ps1`), `sdd-feedback`;
  antes del cierre, `sdd-start-feature` y `executing-plans` en Native
- Proyecto: aplicación web con editor de documentos embebido, backend .NET y frontend React; suite E2E de Playwright con
  3 workers y un entorno Docker por worktree; varias sesiones de agente trabajando a la vez en la misma máquina
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: opus (revisión final, re-revisión y lente de dominio de la review de spec), sonnet (lente
  técnica)
- Coste en reloj: 12 h frente a 9 h estimadas (+33 %); unas 4 h fueron la suite E2E del cierre (walkthrough, §2)
- Coste en tokens: hilo 325.041.084; subagentes 10.708.431 en 4 despachos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La suite del cierre se pasó con un interruptor que cambia su resultado

- **Qué pasó**: el proyecto tiene un interruptor de CPU para los E2E (traza sin capturas), documentado en sus
  instrucciones como «apagado por defecto, para quien lo encienda en su máquina». Lo encendí en todas las pasadas de
  verificación del cierre. Con él caían 10 de 26 tests, de forma determinista, también con el código de la rama de
  integración y con el de otra feature cerrada. La configuración de Playwright ya avisaba: «al ir más rápida destapa
  carreras que la traza completa esconde». Sin el interruptor, la misma rama pasó 25 de 25.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 0 («tu smoke (una fila por THEN y la suite)») y paso 1
  (verificación); `skills/sdd-start-feature/SKILL.md` paso 7 (el smoke y la suite antes de validar). Ninguno dice en qué
  configuración se pasa la suite.
- **Por qué el kit no lo evitó**: el kit pide «la suite» sin fijar que sea la del gate tal como la declara el proyecto,
  sin variables que cambien su tiempo o su traza. Un agente que ahorra CPU arrastra a la verificación lo que solo vale
  para iterar.
- **Coste**: unas 4 h de la mañana del cierre, entre pasadas y la búsqueda de la causa en el entorno (walkthrough, §2,
  «Desviación»); respaldado por los commits `88af14b` y `2029a1c`, que registran el antes y el después.
- **Propuesta**: en el paso 0 de `sdd-end-feature` y en el 7 de `sdd-start-feature`: «la suite del cierre se ejecuta con
  el comando del gate del proyecto y sin las variables de entorno que el proyecto declara como ajustes de máquina (CPU,
  traza, analizadores); si las tienes exportadas en la sesión, quítalas antes y dilo en la línea de la suite del
  walkthrough».
- **Verificada**: sí — contrastado en la sesión: la misma rama, en el mismo entorno, 10 fallos con el interruptor y 25
  de 25 sin él (`moon run frontend:e2e`, PowerShell 7, Windows 11).
- **Criterio de aceptación**: GIVEN un proyecto cuyas instrucciones declaran un interruptor de traza para los E2E y una
  sesión que lo tiene exportado, WHEN el agente pasa la suite del cierre, THEN la lanza sin el interruptor y el
  walkthrough dice con qué configuración la pasó.

### 2. Se culpó al entorno sin comparar antes con la rama base en las mismas condiciones

- **Qué pasó**: ante la suite en rojo, fui probando hipótesis del entorno una tras otra: la carga de la máquina, la
  imagen del contenedor del editor, el volumen de datos (vacié el entorno), la versión de Playwright. La comparación que
  lo decidía —la rama base y la rama de la feature, en el mismo entorno y con la misma configuración— la hice tarde y
  mal: las primeras bases de comparación llevaban también el interruptor del hallazgo 1. El usuario tuvo que pararme
  tres veces.
- **Dónde en el kit**: no localizado. Lo más cercano es `superpowers:systematic-debugging` (fase 1, «Check Recent
  Changes» y «Find Working Examples»), que es genérico; `sdd-end-feature` no dice qué hacer cuando el gate sale en rojo.
- **Por qué el kit no lo evitó**: no hay paso para «la suite del cierre está en rojo». El agente improvisa y empieza por
  la explicación que le exonera (el entorno) en vez de por la comparación que la decide.
- **Coste**: incluido en las 4 h del hallazgo 1; reparto sin respaldo.
- **Propuesta**: en `sdd-end-feature`, una regla para el gate en rojo: «antes de atribuir un fallo al entorno o a la
  carga, pasa la rama base con el mismo comando, en el mismo entorno, recién limpio, y apunta las dos cifras en el
  walkthrough: si la base pasa y la rama no, el fallo es de la rama».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una suite del cierre con fallos que el agente sospecha del entorno, WHEN responde al
  rojo, THEN su primera acción es pasar la rama base en las mismas condiciones y el walkthrough recoge las dos pasadas
  antes de cualquier otra hipótesis.

### 3. La rama base avanzó durante el cierre y cada integración obligó a repetir la suite

- **Qué pasó**: durante el cierre, la rama de integración recibió varios merges de otras sesiones. La integré dos veces a
  mano en la feature. Cada vez hubo que resolver conflictos (el número de versión de un plugin servido desde el editor,
  que la otra rama también había subido), vaciar el entorno y repetir la suite completa, de 5 a 6 min por pasada, más
  las pasadas que caían por carreras. Al final, `Invoke-SddMerge.ps1` integró otros tres commits nuevos y solo los
  verificó con el `-VerifyCommand` rápido, sin la suite.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 10 y `references/merge-recipe.md` («El script hace…»,
  paso 2, y «`-VerifyCommand`»).
- **Por qué el kit no lo evitó**: el kit no dice cuándo integrar la base en la rama durante el cierre. Integrar a mano
  antes de la suite y después dejar que el script vuelva a integrar duplica el trabajo, y lo último que entra no pasa la
  suite.
- **Coste**: unas 1,5 h entre las dos integraciones, sus conflictos y sus suites; sin respaldo más allá de los merges
  `659b3c7` y `007bb87`.
- **Propuesta**: fijar un solo momento: «no integres la base a mano durante el cierre salvo conflicto; la integra
  `Invoke-SddMerge.ps1`, y si el proyecto separa un gate rápido de la suite completa, el informe final dice qué commits
  de la base entraron sin pasar la suite».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una rama base que avanza mientras se cierra una feature, WHEN el agente cierra,
  THEN integra la base una sola vez, con el script, y el mensaje final nombra los commits de la base que solo pasaron el
  gate rápido.

### 4. Los servidores que usa la suite los había arrancado otro, y se cayeron a mitad

- **Qué pasó**: la web de desarrollo del worktree la había arrancado otro proceso, fuera de la sesión, y se cayó a mitad
  de una pasada, justo cuando el gestor de worktrees creaba uno nuevo. La suite no lo detecta: los tests fallan con
  `net::ERR_CONNECTION_REFUSED` y parece un fallo del código. Otra sesión vio lo mismo con su API parada (`connect
  ECONNREFUSED`). Además, la suite solo pasa sobre un entorno recién vaciado: con restos de una pasada anterior, un test
  no puede borrar los datos que dejó otro usuario de test.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 10 (`env:clean` antes de `finishing-a-development-branch`,
  con `environments.md`); no hay paso que prepare el entorno antes de la suite del cierre.
- **Por qué el kit no lo evitó**: el kit trata el entorno solo al final, para limpiarlo; no pide que la suite del cierre
  corra sobre un entorno recién levantado ni con los servidores arrancados por la sesión que la pasa.
- **Coste**: dos pasadas perdidas, unos 15 min; sin respaldo más allá de §4.2 del walkthrough.
- **Propuesta**: con `environments.md`, antes de la suite del cierre: «vacía y levanta el entorno, arranca tú la web y
  el API del worktree, comprueba que responden, y vuelve a comprobarlo si la suite falla con errores de conexión antes
  de mirar el código».
- **Verificada**: sí — tras hacerlo así, la suite pasó 25 de 25 y la web siguió viva toda la pasada (walkthrough, §4.2).
- **Criterio de aceptación**: GIVEN un proyecto con `environments.md` y la web del worktree caída, WHEN el agente lanza
  la suite del cierre, THEN antes ha levantado el entorno y los servidores, y un fallo de conexión no se atribuye al
  código.

### 5. La fusión del delta sustituye reglas enteras y borra lo que añadió la base

- **Qué pasó**: la spec traía en su delta una regla de la capacidad completa con una frase nueva. Entre la spec y el
  cierre, otras tres features añadieron frases a esa misma regla en la base. `Merge-CapabilityDelta.ps1` sustituyó la
  regla entera por la de la spec y borraba las tres aportaciones, sin avisar: lo vi al leer el diff. Lo resolví con una
  fusión a tres bandas, frase por frase, de base de la spec, spec y base actual, y la puse en la spec antes de volver a
  fusionar. Además, la regla de la capacidad viva tiene líneas sin sangrar a mitad, y el recorte que hice a mano para
  compararla se paraba en ellas.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 4 y `skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1`.
- **Por qué el kit no lo evitó**: el script compara la regla de la spec con la viva, no con la que había cuando se
  escribió la spec, y no sabe qué partes son de otra feature.
- **Coste**: unos 40 min; sin respaldo más allá del commit `85723b3`, cuyo cuerpo lo cuenta.
- **Propuesta**: que el script reciba la base de la spec (el commit de su apertura) y fusione las reglas a tres bandas,
  o que se niegue a sustituir una regla que cambió en la base desde ese commit y diga qué frases perdería.
- **Verificada**: sí — `git merge-file -p` de las tres versiones, frase por frase, dio 0 conflictos, y la regla
  resultante solo difería de la base en las frases de la feature (comprobado por diff de frases).
- **Criterio de aceptación**: GIVEN una spec cuyo delta sustituye una regla a la que la base añadió una frase después de
  escribirla, WHEN se ejecuta `Merge-CapabilityDelta.ps1`, THEN la regla fusionada conserva la frase de la base o el
  script falla nombrándola.

## Lo que hice por iniciativa propia

- Paquete de la re-revisión solo con el tramo de la feature: `git log --first-parent --no-merges` del tramo más
  `git show --remerge-diff` de cada merge, sin la fusión en `capabilities/` ni el changelog que genera el script. La
  receta de `encargo-revision.md` corta desde el merge-base y arrastraba lo de otras features (4.560 líneas frente a
  1.149). Funcionó: el revisor no se perdió en código ajeno.
- Comprobar con una mutación que un test nuevo del arreglo fija lo que dice (quitar la guarda y verlo en rojo), porque el
  revisor señaló que el test pasaba sin ella. Funcionó.
- Volver a fusionar el delta desde la capacidad de antes de la primera fusión, cuando el script rechazó un ADDED ya
  fusionado.

## Funcionó, no tocar

- `Invoke-SddMerge.ps1`: integró lo nuevo del remoto, fusionó en el checkout principal limpio, pasó el gate y publicó la
  rama destino sin pasos a mano.
- `Test-Roadmap.ps1`: avisó de que el «Destino» de una fila nueva de deuda no empezaba por «Actuar».
- `Measure-SessionTokens.ps1` y `Build-EstimationLog.ps1`: cifras pegadas sin retocar y fila del log regenerada.
- La guarda de la receta de hitos: con merges en el tramo, el cierre no se juntó, y los shas de `tasks.md` siguieron en
  la rama.

## Menores

- Escribí en `tasks.md` el sha de la pasada de fix antes de tener el commit, uno inventado, y lo corregí al leerlo —
  `references/commit-milestones.md` («El hash en los artefactos»).
- El proyecto no declara gate de merge en `tech-stack.md`, y elegí yo el `-VerifyCommand` — `references/merge-recipe.md`
  («`-VerifyCommand`»).
- La línea de tokens de subagentes que imprime `Measure-SessionTokens.ps1` supera la longitud máxima de línea del lint
  de Markdown, y la pegué con una excepción del lint en vez de partirla — `skills/sdd-end-feature/SKILL.md` paso 2.
