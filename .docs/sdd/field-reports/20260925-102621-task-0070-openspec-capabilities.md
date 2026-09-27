---
kit_version: 1.1.0 (skills del working tree de develop, camino de la 2.0.0)
superpowers_version: 6.4.1
lane: task
id: 20260925-102621-task-0070-openspec-capabilities
task: 0070
mode: full
date: 2026-09-25
---

# Ticket para el kit — task 0070: capacidades sin historial, con validador y con bloque «Capacidades»

## Contexto

- Carril y modo: task full, perfil `delegate`, spec aprobada por delegación en la primera pregunta
- Skills del kit usadas: `sdd-start-task`, `sdd-templates`, `sdd-end-task`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`
- Proyecto: el propio kit (Markdown y scripts de PowerShell con Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet (revisor de spec y 17 sujetos), Opus con effort high (revisor final)
- Coste en reloj: ~2,6 h (spec y plan ~1 h, implementación ~1,6 h)
- Coste en tokens: hilo 56,7 M, subagentes 5,3 M; 21,34 $ de sesión más 6,58 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El revisor final encontró tres Important que el GREEN no podía ver: el script no se probó contra la plantilla que valida

- **Qué pasó**: `Test-Capabilities.ps1` pasó 24 tests y el GREEN (7/7 en verde). El revisor final confirmó que rechazaba la cabecera de la propia `capability-template.md` (`## Reglas de la capacidad *(opcional; …)*`) y la `## Historial *(opcional)*` de 1.x, y que un bloque «Capacidades» vacío pasaba. Los fixtures se escribieron a mano, con la forma limpia, y el molde de los sujetos también.
- **Dónde en el kit**: `.docs/sdd/architecture.md`, «Anatomía de la evidencia», punto de `<script>.Tests.ps1`; y el plan de la task, que fija los fixtures.
- **Por qué el kit no lo evitó**: la regla de fixtures dice «líneas reales de walkthroughs y patches», pero no «el artefacto calcado de la plantilla tal cual». Un validador de un formato del kit se prueba con lo que produce el kit.
- **Coste**: una ronda de arreglos tras la revisión final, dos enmiendas de la spec, una pregunta al dev-lead y 2 sujetos de control (0,66 $).
- **Propuesta**: en «Anatomía de la evidencia», que todo script que lea un artefacto del kit tenga un test con la plantilla de `sdd-templates` calcada sin tocar, y otro con la plantilla calcada y rellenada a medias.
- **Criterio de aceptación**: GIVEN `capability-template.md` copiada tal cual como `capabilities/x.md` con el título ajustado, WHEN se ejecuta el validador, THEN no hay ningún fallo por la nota de la cabecera; en el RED de hoy, «sección «Reglas de la capacidad *(opcional; …)*» no admitida».

### 2. El paquete de la revisión final de `executing-plans` arrastra los merges de sincronización

- **Qué pasó**: `review-package PLAN 638408a HEAD` generó 9 MB y 21 commits, porque la rama había integrado `develop` dos veces (lo pide el enunciado cuando otra task comparte ficheros). Rehice el paquete con `git diff develop HEAD` y las exclusiones de `red/` y `green/` de `tech-stack.md`: 179 KB.
- **Dónde en el kit**: `skills/sdd-start-task/references/encargo-revision.md`, sección «Revisor final»; `tech-stack.md` («Paquete de revisión sin evidencia»).
- **Por qué el kit no lo evitó**: la regla del paquete sin evidencia existe, pero el encargo del revisor final remite al script de superpowers, que corta por rango `BASE..HEAD` e incluye lo que trajeron los merges.
- **Coste**: un turno y el riesgo de un revisor leyendo el trabajo de otras tres tasks (~5 M tokens de Opus en esta revisión).
- **Propuesta**: en el encargo del revisor final, «si la rama integró la rama de integración, el paquete es `git diff <integración> HEAD` con las exclusiones de evidencia, no el rango del script».
- **Criterio de aceptación**: GIVEN una rama con un merge de `develop` que trae 3 tasks ajenas, WHEN el hilo prepara la revisión final, THEN el paquete no contiene ningún fichero de esas tasks.

### 3. Una fila nueva del roadmap junto a la de la task da un conflicto que parece freno de alcance

- **Qué pasó**: al integrar `develop` antes de la última task, la fila 0073 se había insertado justo debajo de la 0070, y git dio un conflicto en la fila 0070. El freno «fila de la task cambiada en la base» parecía saltar; comparando la fila en la base y en `develop` salió idéntica. Fue un conflicto de posición.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6 (comprobación de la fila en la base) y la receta del merge de `sdd-end-task` (conflicto solo en los registros).
- **Por qué el kit no lo evitó**: el paso 6 compara con `git diff`; no dice qué hacer cuando el conflicto aparece al integrar, que es donde se ve primero.
- **Coste**: dos turnos para descartar el freno.
- **Propuesta**: en el paso 6, «si un merge de sincronización da conflicto en la fila de la task, compara la línea que empieza por `| <id> |` en la base y en la integración: si es igual, es de posición y se resuelve con las dos filas».
- **Criterio de aceptación**: GIVEN otra task que inserta su fila justo debajo de la de esta, WHEN se integra `develop`, THEN el agente resuelve con las dos filas y no para.

## Lo que hice por iniciativa propia

- **Ensayo del molde sin sujeto** (`DRY=1` en el lanzador): construir cada escenario y leer `git log` y el fichero medido antes de gastar un sujeto. Así vi que, tras integrar `develop`, `git merge-base` ya es su punta, y que la propuesta de la pieza (4) del ticket 0068 no detectaría el caso. Funcionó: cero sujetos perdidos por el molde.
- **Una tanda más sin la pista incidental**: el primer sujeto del RED sacó la conducta de la frase de validación de la petición, y los dos siguientes, del `(antes:)` opcional. Relancé quitando cada pista hasta que la conducta solo podía venir de leer la capacidad. Con eso, la pieza pasó a deuda con evidencia en vez de por intuición.
- **Validar el repo con el script antes de la revisión**: la review de spec avisó de un fichero con reglas en negrita, y el validador encontró cuatro.

## Funcionó, no tocar

- La opción «apruebo la spec por delegación» en la primera pregunta: el dev-lead la eligió y la task llegó a la validación sin paradas, salvo las tres decisiones que eran suyas.
- El RED antes de la spec: sacó una pieza entera (6/6 limpio) por 3,32 $ antes de escribir guía.
- `SUBJECT_CAP` y `COST_CAP` en el lanzador, con el techo común: la campaña terminó justo en 17 sujetos sin que el hilo contara a mano.
- La review de spec con una lente: encontró un fallo real del repo (las reglas pegadas) que la auditoría a mano no vio.

## Errores míos, no huecos del kit

- En la primera pregunta recomendé «seguir entera», y el paso 2 de `sdd-start-task` dice que, con más de 3 tasks, la recomendada es partir. El dev-lead eligió igual, pero la recomendación no siguió la regla.
- Escribí dos veces un `\b` de PowerShell desde un heredoc de Python y acabó como retroceso (0x08): una en el script y otra en `tech-stack.md`, precisamente en el aprendizaje que lo describe. Lo cazaron un test y una búsqueda de caracteres de control.
- Edité `run.sh` mientras corría la segunda tanda del RED, que es lo que `tech-stack.md` prohíbe. No rompió nada porque `sed -i` crea un fichero nuevo.
