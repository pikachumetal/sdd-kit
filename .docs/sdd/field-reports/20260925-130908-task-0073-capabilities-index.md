---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: task
id: 20260925-130908-task-0073-capabilities-index
task: 0073
mode: full
date: 2026-09-25
---

# Ticket para el kit — task 0073: índice de capacidades generado

## Contexto

- Carril y modo: task full, perfil `delegate`, spec aprobada por delegación desde la primera pregunta
- Skills del kit usadas: `sdd-start-task`, `sdd-end-task`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`
- Proyecto: el propio kit (Markdown y scripts PowerShell 7 con Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5 (review de spec, sujetos de la campaña) y Opus 5.5 (revisión final)
- Coste en reloj: ~1,5 h (0,5 spec y plan, 1,0 implementación)
- Coste en tokens: hilo 36,4 M, subagentes 4,5 M; 15,49 $ de sesión y 4,70 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Con la spec aprobada por delegación en la primera pregunta, nadie ofrece bajar el modelo de la sesión

- **Qué pasó**: el dev-lead eligió en la primera pregunta «apruebo la spec por delegación, nos vemos en la validación». La oferta de parar antes de la Task 1 para bajar la sesión a gama media vive en el gate de la spec (paso 4) y en el del plan (paso 5, solo `pair`); con el gate de la spec quitado y `delegate` sin gate de plan, no hubo ningún sitio donde ofrecerla. Todo el plan se ejecutó en Native con Opus.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` pasos 2 y 4 (la opción de delegación y la oferta del modelo).
- **Por qué el kit no lo evitó**: las dos reglas se midieron por separado (`tests/fewer-stops-red.md` s2 y `tests/session-model-red.md` d4); ninguna medición combinó la delegación desde la primera pregunta con una sesión en el modelo más capaz.
- **Coste**: 12,79 $ de hilo en Opus para tres tasks que el propio plan declaraba aptas para gama media.
- **Propuesta**: si la sesión va con el modelo más capaz, la opción de delegación de la primera pregunta tiene una variante «… y paras antes de la Task 1 para que baje la sesión a gama media», con el mismo motivo que el paso 4.
- **Criterio de aceptación**: GIVEN perfil `delegate` y sesión en Opus · WHEN el agente formula la primera pregunta · THEN entre sus opciones hay una que aprueba la spec por delegación y para antes de la Task 1 para cambiar el modelo; RED: hoy 0 de 1 (esta sesión).

### 2. La previsión de la campaña cuenta los pasos nuevos de las skills y olvida los de las referencias

- **Qué pasó**: la spec declaró la campaña para las tres skills que ejecutan el índice. La migración a v2.0.0 ganó un paso que pide al agente redactar (el propósito de cada capacidad, sin la procedencia) y solo tenía un test estático. Lo encontró la revisión final como Importante (Art. I: «una conducta o un paso nuevos llevan la campaña completa»); hubo que parar al dev-lead, pasar de la previsión y lanzar dos sujetos más.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 4 (spec) y `skills/sdd-start-task/references/review-spec.md` (la lente técnica no pregunta por la campaña); `constitution.md` Art. I.
- **Por qué el kit no lo evitó**: nada pide enumerar, al declarar la previsión, cada paso nuevo o cambiado en cualquier fichero que un agente sigue (skills, referencias, migraciones); el agente pensó en «skills» como `SKILL.md`.
- **Coste**: una parada del dev-lead tras la revisión final, 0,59 $ y ~15 min.
- **Propuesta**: la decisión de campaña de la spec lista cada paso nuevo o cambiado de cualquier texto que el agente ejecuta (incluidas `references/` y `migrations/`), con su escenario o el motivo de no medirlo; la lente técnica de la review de spec lo comprueba.
- **Criterio de aceptación**: GIVEN una spec cuyo delta añade un paso a `migrations/vX.Y.Z.md` que exige redactar · WHEN se escribe la decisión de campaña · THEN el paso aparece con su escenario o con su motivo; RED: hoy la previsión de esta spec no lo nombra.

### 3. El freno «fichero de la task cambiado en la base» para en ediciones que no se solapan de un documento de anclaje

- **Qué pasó**: antes de la Task 2, `tech-stack.md` había cambiado en `develop` (patch 0076) en otras tres líneas; la task solo añadía una mención en la línea 5. El freno paró al dev-lead, que estaba ausente. Esta vez la parada sirvió: el dev-lead eligió integrar `develop`, lo que trajo también el lanzador de referencia.
- **Dónde en el kit**: `skills/sdd-start-task/references/control-profiles.md`, «Fichero de la task cambiado en la base».
- **Por qué el kit no lo evitó**: el cruce es por nombre de fichero; `tech-stack.md` y `architecture.md` los tocan casi todas las tasks, como los tres registros exentos.
- **Coste**: una parada del dev-lead.
- **Propuesta**: no cambiar el freno, pero pedir que la pregunta diga si los tramos se solapan (`git diff -U0` de la base frente a las líneas que la task va a tocar), para que el dev-lead decida con ese dato; medir antes si el solape cambia su respuesta.
- **Criterio de aceptación**: GIVEN un fichero de la task cambiado en la base en líneas que la task no toca · WHEN salta el freno · THEN la pregunta dice «la base cambia las líneas A–B; la task toca C» y ofrece seguir o integrar.

### 4. `plan-template.md` no tiene la sección «Review Focus» que pide `writing-plans`

- **Qué pasó**: el handoff de `writing-plans` 6.4.1 exige en la cabecera del plan «Global Constraints» y «Review Focus», y que `executing-plans` pase ese «Review Focus» al revisor final. La plantilla del kit tiene «Restricciones globales», pero no un sitio para los fallos que ningún test ejercita, así que el revisor final no lo recibió.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`.
- **Por qué el kit no lo evitó**: la plantilla es anterior a esa sección de superpowers.
- **Coste**: bajo en esta task; el revisor encontró solo lo que la lista habría señalado (la migración sin campaña).
- **Propuesta**: comprobar en los `RELEASE-NOTES.md` de superpowers desde qué versión existe «Review Focus» y, si el kit la adopta, añadir la sección a la plantilla y al encargo del revisor final de `encargo-revision.md` (Art. IX: adoptar al máximo).
- **Criterio de aceptación**: GIVEN un plan calcado de la plantilla · WHEN se despacha el revisor final · THEN su encargo lleva la sección «Review Focus» del plan literal.

## Lo que hice por iniciativa propia

- Lancé el RED en segundo plano mientras corría la review de la spec y escribía el plan: la campaña no alargó el reloj del hilo (la desviación de -60 % del walkthrough sale de ahí).
- Al bloquear el hook de privacidad el commit de apertura, regeneré las salidas de los sujetos desde los `.jsonl` del scratchpad en vez de relanzarlos: 0 $.
- Mantuve el mismo arnés entre RED y GREEN aunque el lanzador de referencia llegó a `develop` a mitad de task, para no meter una variable en la comparación; quedó como ruling.

## Funcionó, no tocar

- El hook pre-commit con la suite y el test de privacidad de las salidas: paró el commit de apertura con el home de la máquina dentro.
- La opción «apruebo la spec por delegación» en la primera pregunta: el dev-lead la eligió y no hubo parada en la spec.
- `Test-Capabilities.ps1 -Artifact` tras fusionar el delta, y `Measure-SessionTokens.ps1` y `Build-EstimationLog.ps1` en el cierre: salieron a la primera.
- La fila de control del GREEN (Art. I): confirmó sin coste extra que los pasos tocados no retrocedían.

## Errores míos, no huecos del kit

- Copié el `subject.sh` de la campaña anterior, que extraía con un `tools.mjs` sin sanear el home (lo mismo que motivó el patch 0076).
- Un `[IO.File]::ReadAllText` con ruta relativa tras un `Set-Location`: el commit de la Task 3 salió sin el `tasks.md` actualizado.
- Reescribí dos ficheros con CRLF en un working tree con `core.autocrlf=true`, y el diff marcó el fichero entero; y un `$nl3` interpolado que se comió un salto de línea en la migración.
- El test RED de `sdd-roadmap` tomaba el primer «1.» del fichero, que no es el paso de contexto; lo corregí con un ruling.
