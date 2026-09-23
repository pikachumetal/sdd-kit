---
kit_version: 1.1.0 (skills del working tree, release 1.2.0 en curso)
superpowers_version: 6.4.1
lane: task
id: 20260923-135049-task-0033-capabilities-at-birth
task: 0033
mode: full
date: 2026-09-23
---

# Ticket para el kit — task 0033: capacidades al nacer

## Contexto

- Carril y modo: task full, perfil `delegate`
- Skills del kit usadas: `sdd-start-task`, `sdd-end-task`, `add-to-changelog` (las del working tree); `sdd-init-greenfield` y `sdd-init-brownfield` como objeto de medida
- Proyecto: el propio kit (Markdown y PowerShell, una persona)
- Modelo del hilo: Opus 5.5 (spec, plan, Tasks 1-3) → Sonnet 5 (Task 4, tras un `/clear` de contexto entre sesiones)
- Modelos de los subagentes: Sonnet (revisor final de rama); sujetos headless Sonnet
- Coste en reloj: ≈1,6h de implementación (aproximado por marcas de commit, sin reloj de un solo hilo)
- Coste en tokens: hilo no medido; subagentes 153k (1 despacho); sujetos 12,22 $ en 26 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una campaña headless en segundo plano se corta si la sesión que la lanza muere a mitad de camino, y nada avisa de que solo terminó parcialmente

- **Qué pasó**: siguiendo el patrón de campaña de la task 0019, lancé 12 sujetos de un turno con `driver.py` en segundo plano desde una sesión. Esa sesión terminó (relevo de contexto) antes de que 10 de los 12 procesos `claude -p` emitieran su evento `result`: los streams `.jsonl` quedaron truncados, `state.txt` mostraba coste 0,00 $ y `git log` vacío, y un sujeto (`g1a`) ni siquiera llegó a la foto final (`out/g1a/` no existía pese a que su `.jsonl` sí tenía actividad). Solo los dos sujetos más rápidos, que respondían en pocos turnos, alcanzaron a terminar antes del corte. Nada en el flujo avisó de que la campaña había terminado a medias hasta que revisé `state.txt` fichero por fichero.
- **Dónde en el kit**: `tech-stack.md`, sección «Sujetos headless (método desde T9)» — describe cómo lanzar y qué mirar en el stream, pero no dice cómo verificar que una tanda lanzada en segundo plano llegó a completarse antes de leer sus veredictos.
- **Por qué el kit no lo evitó**: la receta de campaña (aquí y en la 0019) asume que "está en `out/<etiqueta>/`" equivale a "terminó". Un corte de sesión deja la carpeta sin crear del todo (o no la crea) sin ningún error visible en el hilo que lanzó la tanda, porque el lanzamiento en segundo plano no espera al resultado.
- **Coste**: ~1h de relanzamiento sujeto a sujeto en la sesión siguiente, más la confusión inicial de no saber cuántos de los 12 habían terminado de verdad.
- **Propuesta**: antes de leer los veredictos de una campaña lanzada en segundo plano, comprobar que cada `state.txt` tiene coste > 0 **y** `git log` no vacío (o una explicación explícita si el sujeto no tocó git); un `state.txt` sin esas dos cosas es "no terminó", no "conducta a evaluar".
- **Criterio de aceptación**: GIVEN una campaña de N sujetos lanzados en segundo plano de los que M se cortan a mitad de proceso por el fin de la sesión que los lanzó, WHEN el hilo revisa los veredictos, THEN detecta los M sujetos incompletos por su `state.txt` (coste 0 y sin `git log`) antes de contarlos como parte del resultado, y los relanza o los descarta explícitamente.

### 2. El clasificador de modo automático del harness bloquea lanzar varios `claude -p` en paralelo desde Bash, aunque sea el mismo patrón de campaña que ya usó el kit antes

- **Qué pasó**: al relanzar los sujetos cortados del hallazgo 1, un único comando Bash que lanzaba 10 procesos `claude -p` en paralelo (con `&` y `wait`, el mismo patrón que describe la campaña de la 0019) fue denegado por el clasificador de modo automático del harness con el motivo «Create Unsafe Agents». Relanzar los sujetos uno por uno, en serie, en llamadas Bash separadas, no lo bloqueó.
- **Dónde en el kit**: no hay una única ruta — el patrón «lanzar N en segundo plano, varios a la vez» aparece en el plan de campañas GREEN (aquí y en la 0019) y no está escrito como receta en `tech-stack.md`.
- **Por qué el kit no lo evitó**: el kit no controla el clasificador del harness, y hasta ahora ninguna campaña había tropezado con este bloqueo (o no se había registrado). No es un fallo del texto de las skills, sino una condición del entorno que el kit no puede prever con una regla textual.
- **Coste**: bajo con el visto bueno inmediato del dev-lead para lanzar en serie; sin él, la campaña se habría bloqueado del todo.
- **Propuesta**: documentar en `tech-stack.md` que el lanzamiento paralelo de sujetos headless puede toparse con este clasificador, y que la alternativa (lanzamiento en serie, más lento pero fiable) es válida y no necesita re-preguntar cada vez si ya se topó una vez en la sesión.
- **Criterio de aceptación**: GIVEN un plan de campaña que dice «lanzar N sujetos en segundo plano, varios a la vez» y un entorno donde el clasificador de modo automático deniega ese lanzamiento, WHEN el agente lo intenta y lo ve denegado, THEN cambia a lanzamiento en serie sin pedir permiso de nuevo por cada sujeto siguiente, y lo anota una vez en el walkthrough.

## Lo que hice por iniciativa propia

- **Ajustar `requests/<escenario>.txt` cuando la petición no dejaba al sujeto llegar al punto bajo prueba**: en dos escenarios (uno de brownfield sin respuestas a la entrevista, otro de greenfield parado en un permiso de `.claude/settings.json` no relacionado con lo medido) añadí una frase a la petición para que el sujeto no se quedara antes del texto que el escenario mide, en vez de aceptar un veredicto débil. Funcionó: los dos escenarios pasaron a medir de verdad la conducta bajo prueba. Candidato a regla: cuando un escenario headless de un turno se queda antes del punto que mide, el arreglo es la petición (qué evitar o qué dar por hecho), no el texto de la skill.

## Funcionó, no tocar

- Reusar el kit ya extraído en el scratchpad de una sesión anterior (mismo commit `HEAD`) para relanzar sujetos sin repetir el `git archive` del Step 1 del plan.
- El revisor final de rama (Sonnet, effort medium, con la cabecera de `encargo-revision.md`) cazó una debilidad real de la evidencia GREEN (un par de sujetos que no llegaba al punto bajo prueba) que yo había dado por buena.

## Errores míos, no huecos del kit

- Un bloqueo de permiso de lectura intermitente sobre los mismos dos ficheros de un molde (3 de 5 intentos, mismo driver, mismo contenido) no tiene explicación que yo haya encontrado; relanzar el mismo sujeto sin cambios lo resolvió las otras veces. No propongo un cambio del kit sobre esto: no sé si es del harness, de la máquina o de algo que hice distinto entre intentos.
