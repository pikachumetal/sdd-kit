---
kit_version: 2.0.0 (marcador del repo; plugin del working tree 2.1.0)
superpowers_version: 6.4.2 (superpowers-marketplace)
lane: feature
id: 20260929-182240-feature-0113-plan-review-focus
task: 0113
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0113: Review Focus del plan, con un patch que paró bien y tres re-revisiones caídas

## Contexto

- Carril y modo: arrancó como patch (`sdd-start-patch`), paró en la causa raíz y pasó a feature full, perfil `delegate`.
- Skills del kit usadas: `sdd-start-patch`, `sdd-start-feature`, `sdd-end-feature` y `sdd-feedback`, con `brainstorming`, `writing-plans`, `executing-plans` y `test-driven-development` de superpowers.
- Proyecto: el propio kit (skills en Markdown y scripts PowerShell con Pester), una persona.
- Modelo del hilo: Opus 5.5.
- Modelos de los subagentes: Opus 5.5 con `sdd-kit:effort-high` (revisor final y re-revisiones) y Sonnet 5.5 (un intento de re-revisión). Sujetos headless: Sonnet y Opus.
- Coste en reloj: ~1,6 h (spec y plan ~0,3 h, implementación y campaña ~1,3 h).
- Coste en tokens: hilo 37,9 M, subagentes 4,3 M, sesión 15,40 $; sujetos 12,03 $.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Cada commit de evidencia en `tests/*.md` tras la revisión final abre otra re-revisión con Opus

- **Qué pasó**:
  - Después de la pasada de fix, la evidencia GREEN (`tests/plan-review-focus-green.md`, ~35 líneas) y su corrección (21 líneas) abrieron cada una una re-revisión del tramo, porque la excepción «revisado en el hilo» solo cubre ficheros bajo `.docs/` o `*.md` de la raíz.
  - Las dos re-revisiones y sus tres reintentos (hallazgo 2) sumaron 2,9 M tokens de subagentes. En total costaron más que la revisión final (1,4 M).
  - La primera solo encontró Minor de redacción, y la segunda Minor sobre la corrección de esos Minor.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, paso 6 («Desvío y ruling», la excepción del commit de solo docs) y paso 7; `skills/sdd-end-feature/SKILL.md`, paso 9. La misma regla está en los tres.
- **Por qué el kit no lo evitó**: la excepción se define por ruta (`.docs/` o `*.md` de la raíz). La evidencia de las campañas de este repo vive en `tests/*.md`, que para la regla es código aunque sea prosa.
- **Coste**: ~2,9 M tokens de Opus, 3 preguntas al dev-lead y ~25 min de reloj con la validación esperando.
- **Propuesta**: que el proyecto declare en `tech-stack.md` qué rutas son documentación a efectos de «revisado en el hilo» (en este repo, `tests/*-red.md`, `tests/*-green.md` y `tests/*-ab.md`), y que los tres pasos lean esa declaración. La alternativa es escribir la evidencia GREEN antes de despachar al revisor final, para que entre en su paquete: la campaña GREEN corre mientras el revisor revisa, así que habría que esperar al GREEN.
- **Criterio de aceptación**:
  - GIVEN una feature del kit con la revisión final limpia y un commit posterior que solo toca `tests/<tema>-green.md` (menos de 20 líneas)
  - WHEN el hilo llega al paso 7
  - THEN lo anota como `revisado en el hilo` y no despacha re-revisión. Hoy despacha una (2 de 2 en esta sesión).

### 2. Un revisor que abre los encargos capturados de los sujetos cae por los safeguards de la API

- **Qué pasó**:
  - La re-revisión de `e4451c29..ec234ac8` pedía contrastar la evidencia con `green/out/r-3/agent-prompts.txt`, que es el encargo del revisor final que un sujeto intentó despachar y `deny-agent.mjs` capturó.
  - Tres despachos se cortaron con «safeguards flagged this message … `[reasoning_extraction]`»: dos con Opus 5.5 y uno con Sonnet 5.5.
  - Terminó con el encargo prohibiendo abrir `red/out/` y `green/out/` y con las líneas que había que contrastar extraídas por el hilo con grep.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, «Revisor final» y «Cómo revisar». No lo dice ninguna referencia; el aprendizaje está ahora en `.docs/sdd/tech-stack.md` (§ Sujetos headless), que solo lee quien mantiene el kit.
- **Por qué el kit no lo evitó**: la receta del paquete excluye `red/` y `green/` del diff, pero nada impide que el encargo mande al revisor a abrirlos para contrastar la evidencia.
- **Coste**: ~1,1 M tokens en los intentos caídos y 2 paradas con pregunta al dev-lead.
- **Propuesta**: una frase en «Cómo revisar» del encargo de revisión: «no abras las salidas de sujetos (`red/out/`, `green/out/`); si hay que contrastar la evidencia, el hilo pega en el encargo las líneas que hacen falta». Para un proyecto consumidor sin campañas no aplica. Valorar si va solo en `tech-stack.md` del kit.
- **Criterio de aceptación**:
  - GIVEN una re-revisión de una evidencia de campaña con capturas de `deny-agent.mjs`
  - WHEN el hilo escribe el encargo
  - THEN el encargo no manda abrir `*/out/**` y lleva las líneas extraídas. RED: 0 de 1 en esta sesión, porque mi primer encargo mandaba abrirlas.

### 3. El Scope de una feature que edita skills da por hecha la guía que el RED, lanzado después, puede quitar

- **Qué pasó**:
  - Art. I habla del «RED previo a la spec», pero `sdd-start-feature` no tiene un paso para lanzarlo antes del gate. Aquí el RED corrió tras aprobar la spec.
  - El Approach decía «la guía de cada punto se escribe solo si su escenario falla», pero el Scope listaba como «Entra» el paso 6 y la frase del implementador, sin condición.
  - El RED salió limpio en esos puntos (e 2/2), y recortarlos fue un desvío con enmienda y pregunta al dev-lead.
  - Además, la previsión de sujetos (2 por escenario en RED y GREEN) no contaba con cambiar de modelo. El RED con Opus gastó 4 sujetos del techo y el GREEN bajó a n=1 en dos escenarios.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 4 (spec) y `skills/sdd-templates/templates/spec-template.md` (Scope). Constitution Art. I, sobre la previsión de la campaña.
- **Por qué el kit no lo evitó**: la plantilla del Scope no tiene forma de marcar un «Entra» como condicionado al RED, y el paso 4 no dice cuándo corre el RED de una feature que edita skills.
- **Coste**: una enmienda, una pregunta al dev-lead y un GREEN con n=1 en e y r.
- **Propuesta**: en una spec que edita skills, cada «Entra» de guía lleva «(si el RED lo demuestra)», o el RED corre antes del gate de la spec. Y la previsión de la campaña reserva sujetos para un segundo modelo si el primero no reproduce el fallo.
- **Criterio de aceptación**:
  - GIVEN una feature del kit con tres puntos de guía y un RED que no reproduce uno de ellos
  - WHEN el hilo recorta ese punto
  - THEN no es un desvío, porque la spec ya lo condicionaba, y el GREEN mantiene n=2.

### 4. Un here-string de PowerShell detrás de `git commit -F -` volvió a fallar

- **Qué pasó**: el primer commit de apertura falló con `error: pathspec '<mensaje>' did not match any file(s)`. Funcionó con `-m $msg`.
- **Dónde en el kit**: ya hay fila de deuda en el roadmap («Un here-string de PowerShell escrito detrás de `git commit -F -` falla»). Este es un reporte más.
- **Por qué el kit no lo evitó**: la fila existe, pero ninguna skill dice cómo commitear desde PowerShell.
- **Coste**: un turno.
- **Propuesta**: la de la fila existente.
- **Criterio de aceptación**: el de la fila existente.

## Lo que hice por iniciativa propia

- **Mirar qué modelo tenía el caso de campo antes de dar por limpio el baseline.** Al salir el RED con Sonnet 0 de 6, miré en el walkthrough de la 0109 qué modelo escribió su plan: Opus. Eso llevó a proponer el RED con Opus, que sí reprodujo el fallo. Candidato a regla: con un baseline limpio que contradice tickets de campo, se contrasta el modelo del ticket antes de recortar (complementa «se mira de dónde sacó cada sujeto la conducta» del Art. I).
- **El molde de un escenario sacado de la salida de un sujeto de otra campaña**: el plan del escenario e es el `plan.md` del sujeto h-1 del patch 0082, retocado. Fue más barato que escribir un plan de cero.
- **El encargo del revisor pegaba las líneas extraídas en lugar de las rutas** tras los cortes de safeguards. Funcionó a la primera (hallazgo 2).

## Funcionó, no tocar

- **`sdd-start-patch` paró en la causa raíz** y mandó la petición a feature sin abrir carpeta, id ni rama: la regla «si la causa exige interpretar requisitos → STOP» funcionó al pie de la letra.
- **Rama sin id renombrada tras reservar** (`feature/plan-review-focus` → `feature/0113-plan-review-focus`), como dice `nombrado.md`.
- **Captura del encargo con `deny-agent.mjs`** para medir el revisor final sin pagarlo: dio la medida r en 7 sujetos por ~0,6-1,2 $ cada uno.
- **El revisor final en segundo plano, anclado en su sha**, mientras corría el GREEN y se escribían los borradores de cierre: su Important entró en la pasada de fix sin bloquear la campaña.
- **La propia sección que añade la feature, en su plan**: el Review Focus de mi plan viajó literal a las tres re-revisiones, y el revisor final comprobó cada línea (encontró que la línea 3 no tenía test y la marcó bien).

## Errores míos, no huecos del kit

- El primer encargo de la segunda re-revisión mandaba abrir las capturas de los sujetos, lo que provocó el hallazgo 2.
- Durante la validación dije que el disparador de la validación diferida quedaba «a mi cargo», y en el cierre lo asigné al dev-lead, que es quien difiere según la regla. Lo digo en el mensaje final.
- Un `Stop-Job -Name *` suelto, sin efecto, en un comando de registro.
