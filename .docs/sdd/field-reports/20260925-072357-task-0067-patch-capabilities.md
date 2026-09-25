---
kit_version: 1.1.0 (marcador del repo; skills de la rama, 2.0.0 en curso)
superpowers_version: 6.4.1
lane: task
id: 20260925-072357-task-0067-patch-capabilities
task: 0067
mode: lite
date: 2026-09-25
---

# Ticket para el kit — task 0067: un GREEN que no mide lo de al lado y un cierre que choca en el historial de una capacidad

## Contexto

- Carril y modo: task lite, perfil `delegate`, spec aprobada por delegación en la primera pregunta
- Skills del kit usadas: `sdd-start-task`, `sdd-end-task`, `sdd-feedback` (las dos últimas leídas de la rama: tras reanudar la sesión, el harness servía `sdd-end-task` desde la caché 1.1.0 y no encontraba `sdd-kit:sdd-feedback`)
- Proyecto: el propio kit (Markdown + scripts PowerShell, una persona)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisor final y re-revisión opus con `sdd-kit:effort-high`; sujetos de campaña sonnet
- Coste en reloj: ~1,4 h de hilo, más una noche en espera de la validación
- Coste en tokens: hilo no medido; subagentes 324k; sujetos 3,65 $ en 12

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El GREEN se dio por limpio sin medir la conducta del paso de al lado

- **Qué pasó**: la guía nueva era un párrafo en el paso 1 de `sdd-end-patch`. El GREEN midió lo que el párrafo pedía (2/2) y el control de la salida corta (2/2), y escribí «sin regresión». Las transcripciones mostraban que el paso 2, juntar el fix y el commit de `patch.md`, había caído de 4/4 en el RED a 1/4. Lo encontró la revisión final. Costó una tanda de REFACTOR y una frase en el paso 2.
- **Dónde en el kit**: `.docs/sdd/constitution.md` Art. I (el recorte repite el requisito recortado como control, pero nada pide controlar la conducta vecina que la guía no toca) y `.docs/sdd/architecture.md` «Anatomía de la evidencia» (`<skill>-green.md`: «veredicto contra cada fallo del RED»).
- **Por qué el kit no lo evitó**: la tabla del GREEN se construye desde los fallos del RED; lo que el RED ya cumplía no aparece en ella, aunque la guía nueva se inserte justo delante.
- **Coste**: una revisión final con un Important, 4 sujetos (1,38 $) y una evidencia GREEN que afirmaba lo contrario de sus transcripciones hasta que se corrigió.
- **Propuesta**: que el GREEN cuente, además de los fallos del RED, cada conducta que el RED cumplía en los pasos que la guía toca o bordea, como fila de control. El aprendizaje ya está en `tech-stack.md` (Aprendizajes por task, 0067); falta llevarlo al Art. I o a la anatomía de la evidencia.
- **Criterio de aceptación**: GIVEN una guía nueva insertada en el paso N de una skill y un RED en el que los sujetos cumplían el paso N+1, WHEN se escribe `<skill>-green.md`, THEN su tabla tiene una fila de control para el paso N+1 con el resultado de cada sujeto.

### 2. Dos tasks que fusionan en la misma capacidad chocan siempre en su «Historial», y la receta lo trata como conflicto de una persona

- **Qué pasó**: la 0063 y esta task fusionaban requisitos distintos en `capabilities/release-flow.md`. Las dos añadían líneas al final de «Historial», y `Invoke-SddMerge.ps1` falló con `merge: conflicto en .docs/sdd/capabilities/release-flow.md, .docs/sdd/estimation-log.md.`. La resolución era mecánica: quedarse las dos tandas en orden de fecha. La receta la manda a una persona, porque el fichero no es uno de los tres registros, y hubo que preguntar al dev-lead.
- **Dónde en el kit**: `skills/sdd-end-task/references/merge-recipe.md`, «Conflicto solo en los registros», punto 1.
- **Por qué el kit no lo evitó**: la lista de registros de solo añadir es `changelog.md`, `roadmap.md` y `estimation-log.md`. El «Historial» de una capacidad es también de solo añadir, y con varias tasks en paralelo por release el choque es la norma.
- **Coste**: una parada del dev-lead en el cierre y un segundo merge de sincronización.
- **Propuesta**: que el punto 1 admita `capabilities/*.md` cuando todos los trozos en conflicto caen dentro de `## Historial` y los dos lados solo añaden líneas; se quedan las dos, en el orden de la capacidad. Un conflicto fuera de «Historial» sigue siendo de una persona.
- **Criterio de aceptación**: GIVEN dos ramas que añaden líneas distintas al final del «Historial» de la misma capacidad, WHEN el script falla con `merge:` y solo esos trozos están en conflicto, THEN el agente sigue la receta de registros sin preguntar y el «Historial» fusionado tiene las líneas de las dos ramas.

### 3. La fila de la task solo existe en la rama de integración y el cierre no tiene cómo cerrarla

- **Qué pasó**: el enunciado decía que la fila la escribiría otra task al cerrar («si al cerrar tu fila ya está en develop, ciérrala»). Al cerrar estaba en `develop`, pero no en la rama. El paso 8 de `sdd-end-task` edita el `roadmap.md` de la rama, y la receta prohíbe `git merge` a mano salvo en un conflicto de registros. Hice un merge de sincronización de `develop` en la feature como ruling.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` paso 8 y `skills/sdd-end-task/references/merge-recipe.md` punto 8 («Es el único `git merge` a mano del cierre»).
- **Por qué el kit no lo evitó**: el kit supone que la fila de una task está en su rama desde la apertura. Una task arrancada con la fila reservada en otra rama (partición, fila escrita por otra task o por `sdd-start-release` en paralelo) no tiene camino.
- **Coste**: un ruling contra la letra de la receta y un commit de merge más en la rama.
- **Propuesta**: en el paso 8, si la fila no está en la rama y sí en la rama de integración, se permite el merge de sincronización de la integración en la feature antes del commit de cierre, con la misma regla de la receta (nunca toca la rama destino).
- **Criterio de aceptación**: GIVEN una task cuya fila del roadmap está en `develop` y no en su rama, WHEN llega al paso 8 del cierre, THEN integra `develop` en la feature con el merge de sincronización, cierra la fila en el mismo commit de cierre y no edita `develop` a mano.

## Lo que hice por iniciativa propia

- Construí el molde del RED en seco (crear el repo de juguete y pasar sus tests) antes de lanzar sujetos. Encontró dos errores de escape en el molde que habrían tirado 4 sujetos. Coste nulo; candidato a paso fijo del método de campaña en `tech-stack.md`.
- Moldeé el RED con la forma de campo («cierra el patch», sin nombrar capacidades) porque el E3 de la task 0003 había salido limpio con una petición que ya decía que el fix cambiaba un requisito. El fallo apareció (1/2) y el acierto salió de una lectura incidental. Funcionó.
- Contrasté cada fusión de la puesta al día con el código actual del kit y no solo con el `patch.md`: un patch posterior puede haber cambiado otra vez lo mismo.

## Funcionó, no tocar

- La opción «apruebo la spec por delegación, nos vemos en la validación» en la primera pregunta: el dev-lead la eligió y la task no paró en el gate de la spec.
- Previsión y techo comunes con `SUBJECT_CAP` y `COST_CAP` en el lanzador: la tanda de REFACTOR cupo exacta (12 de 12) sin vigilar a mano.
- «Antes de recortar por un baseline limpio, se mira de dónde sacó cada sujeto la conducta» (Art. I): evitó dar el RED por limpio con un acierto incidental.
- El hook `SessionStart` del repo avisó al reanudar de que las skills venían de la caché, y eso llevó a leer `sdd-end-task` de la rama (la caché 1.1.0 no tenía la política de merge ni el mensaje final).
- La revisión final Opus con effort high: encontró la regresión y el camino sin medir; la re-revisión por `SendMessage` al mismo revisor costó 30 s.

## Errores míos, no huecos del kit

- Escribí «sin regresión» en el GREEN sin contar los commits de cada sujeto, que estaban en el `state.txt` que ya había abierto.
- Dos errores de escape de `\n` al generar el molde con Python dentro de un heredoc de bash.
