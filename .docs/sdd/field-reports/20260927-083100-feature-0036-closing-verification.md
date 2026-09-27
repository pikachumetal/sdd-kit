---
kit_version: 1.1.0
superpowers_version: 6.4.1 (los sujetos cargaron 6.4.2 de la caché)
lane: feature
id: 20260927-083100-feature-0036-closing-verification
task: 0036
mode: full
date: 2026-09-27
---

# Ticket para el kit — feature 0036: verificación de cierre, qué cuenta

## Contexto

- Carril y modo: feature full, perfil `delegate`, spec aprobada por delegación en una segunda pregunta
- Skills del kit usadas: `sdd-start-feature` (leída de la rama: el harness sirvió `sdd-start-task`, ya renombrada), `sdd-templates`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, PowerShell con Pester, lanzador bash de sujetos headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisor final Opus con `sdd-kit:effort-high`; 21 sujetos headless Sonnet
- Coste en reloj: ~4,5 h (spec, plan y RED ~0,5 h; implementación y campañas ~3,5 h; cierre ~0,5 h)
- Coste en tokens: hilo 49.384.059, subagentes 2.239.134; 24,24 $ de sesión y 8,96 $ de sujetos
- Harness: la herramienta PowerShell bloqueó dos órdenes enteras por un `Remove-Item` o un `tr -d '\r'` que interpretó como borrar una ruta del sistema, sin ejecutar nada de lo anterior.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un molde que deja ver el disparador lo anticipa el sujeto, y el GREEN no mide el camino de campo

- **Qué pasó**: el frente de `task-done` (ticket 0061 §1) necesitaba un pre-commit que rechazara el commit. En el RED, 1 de 2 sujetos lo reprodujo. En el GREEN y en el REFACTOR, 4 de 4 leyeron el test ajeno o el script del hook antes de commitear y lo arreglaron antes. No hubo ningún `complete` falso, pero tampoco hubo disparador. La campaña se amplió dos veces (de 15 a 19 sujetos y de 19 a 21) y el frente quedó como deuda.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Comprobación previa de cada escenario» (siete preguntas). No es un fallo de una skill.
- **Por qué el kit no lo evitó**: la comprobación previa pregunta si el molde ofrece una salida que la guía quiere cerrar, pero no si el sujeto puede ver el disparador leyendo el molde antes de llegar al paso medido.
- **Coste**: 4 sujetos (~1,9 $) y una parada del dev-lead para ampliar el techo, sin veredicto.
- **Propuesta**: una octava pregunta en esa comprobación: «¿el disparador se puede anticipar leyendo el molde (un test que contradice la spec, un hook legible)? Si sí, el disparador tiene que salir de algo que solo existe al ejecutar».
- **Criterio de aceptación**: GIVEN un frente cuyo fallo depende de que falle un comando del sujeto · WHEN el autor diseña el molde siguiendo la comprobación previa · THEN el disparador aparece en 2 de 2 sujetos del RED.

### 2. La primera pregunta de `sdd-start-feature` junta más decisiones de las que caben en una pregunta cerrada

- **Qué pasó**: el paso 2 pide que una sola pregunta, y sola en su turno, confirme carril, modo y perfil, proponga partir la feature si prevé más de 3 tasks, ofrezca aprobar la spec por delegación y, en Opus con más de una task, la variante de gama media. `AskUserQuestion` admite 4 opciones, y las instrucciones globales del dev-lead piden «una decisión por pregunta». Pregunté solo el alcance (partir o seguir entera) y tuve que hacer una segunda pregunta para la delegación de la spec: una parada más.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, paso 2, párrafos segundo y tercero.
- **Por qué el kit no lo evitó**: el paso no dice cómo combinar la propuesta de partir, que es una decisión de alcance, con las opciones de delegación en una pregunta de 4 opciones como máximo.
- **Coste**: una parada del dev-lead.
- **Propuesta**: cuando la primera pregunta lleva la propuesta de partir, las opciones de delegación viajan como sufijo de cada opción de alcance («Seguir entera y apruebo la spec por delegación»), o el paso fija que la delegación va en la misma herramienta como segunda pregunta del mismo turno.
- **Criterio de aceptación**: GIVEN una fila que prevé más de 3 tasks, perfil `delegate` y el dev-lead que se va a ausentar · WHEN el agente hace la primera pregunta · THEN en un solo turno el dev-lead puede elegir a la vez el alcance y la aprobación de la spec por delegación.

### 3. El lanzador de referencia no ayuda a parar lo que arranca un sujeto web

- **Qué pasó**: 5 de 6 sujetos web arrancaron en otro puerto que el `PORT` del molde, y dos chocaron en el mismo. La limpieza y la medida «escuchando al acabar» miraban solo el `PORT` del molde, así que una métrica de la evidencia no medía lo que decía; lo vio la revisión final. Un servidor quedó vivo en la máquina hasta que el hilo lo encontró.
- **Dónde en el kit**: `tests/headless/lib.sh` (no tiene ayuda para servidores); la solución vive hoy en `green/web.sh` de la carpeta de la 0036 (`subject_ports`) y en su hook `deny-kill.mjs`.
- **Por qué el kit no lo evitó**: el lanzador de referencia nace del patch 0076, antes de las campañas web.
- **Coste**: una ronda de la revisión final y un servidor huérfano.
- **Propuesta**: `lib.sh` gana `subject_ports` y una parada por puerto al acabar, y `deny-kill.mjs` pasa a `tests/headless/` con sus casos en `tests/DenyKillHook.Tests.ps1`.
- **Criterio de aceptación**: GIVEN un sujeto cuyo stream arranca `node server.mjs` con `PORT=4747` y un molde con `PORT=4646` · WHEN termina `subject_save` · THEN nada escucha en 4747 ni en 4646, y el `state.txt` dice qué puertos encontró.

## Lo que hice por iniciativa propia

- **El hook que deniega parar por nombre en los sujetos web.** Añadido tras el primer sujeto del RED, que paré por su PID para no arriesgar los MCP de las sesiones abiertas en la máquina. Funcionó: 0 órdenes denegadas en 21 sujetos. La revisión final encontró formas que dejaba pasar.
- **Releer los 15 streams de la campaña de la 0077 como RED a coste cero** para cuatro de los ocho frentes, en vez de lanzar sujetos. Funcionó.
- **Variante `v7f` del molde de la 0077**, con la verificación visual ya hecha: en la 0077, 3 de 4 sujetos de `v7` paraban antes del guion y el guion era lo que había que medir. Funcionó: 4 de 4 llegaron al guion.

## Funcionó, no tocar

- La regla del `CLAUDE.md` del repo para una skill renombrada: leí `skills/sdd-start-feature/SKILL.md` de la rama en vez de la `sdd-start-task` que sirvió el harness.
- La parada por dinero del Art. I: el dev-lead amplió el techo dos veces con una pregunta de tres opciones cada vez.
- El freno «fichero cambiado en la base» se vio al comprobar la base antes de la Task 3, con el diff por tramos.

## Errores míos, no huecos del kit

- Ejecuté `task-done` de las Tasks 3, 4 y 5 al final de la campaña y no al cerrar cada una, en una feature que endurece justo ese orden.
- Hice el commit de la Task 3 antes de mirar el diff de la base que ya había pedido.
- Dos cifras de la evidencia del GREEN estaban mal sumadas («8 de 16», «1 de 3»); las vio la revisión final.
