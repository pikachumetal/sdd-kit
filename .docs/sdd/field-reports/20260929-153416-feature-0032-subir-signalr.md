---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260929-153416-feature-0032-subir-signalr
task: 0032
mode: lite
date: 2026-09-29
---

# Ticket para el kit — feature 0032: subida de versión de una dependencia en modo lite

<!-- cspell:ignore despues cerrart -->

## Contexto

- Carril y modo: feature lite, perfil `delegate`, spec aprobada por delegación en la primera pregunta
- Skills del kit usadas: `sdd-start-feature`, `superpowers:brainstorming`, `sdd-end-feature`, `add-to-changelog`,
  `sdd-feedback`
- Proyecto: monorepo con API .NET y SPA React, tres contenedores por worktree, una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (`sdd-kit:effort-medium`), un despacho (revisor final)
- Coste en reloj: ~0,5 h
- Coste en tokens: hilo 7.212.460 · subagentes 324.144

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La receta del merge ordena el push antes de comprobar si hay remoto

- **Qué pasó**: con `merge.push: true` y perfil `delegate`, pasé `-Push` a `Invoke-SddMerge.ps1`. La rama
  destino no tenía remoto y el script falló con `push: no hay remoto configurado para 'develop'.`. Hubo que
  relanzarlo sin `-Push`.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, sección «Push». Las reglas 1–4 van
  numeradas y la del remoto ausente va en un párrafo después de ellas.
- **Por qué el kit no lo evitó**: la regla 3 («`merge.push: true` → `-Push`, sin preguntar») se lee como
  suficiente, y la excepción del remoto queda fuera de la lista numerada. Además, `sdd-kit.json` admite
  `push: true` en un repo sin remoto sin que nadie avise.
- **Coste**: bajo. Un intento fallido, sin efectos, porque el script comprueba antes de fusionar.
- **Propuesta**: poner «sin remoto para la rama destino → sin `-Push`» como regla 0 de la lista. O que el script,
  con `-Push` y sin remoto, fusione y diga `push: no hecho: sin remoto` en vez de abortar. Y que `sdd-config`
  avise de `merge.push: true` cuando `git remote` está vacío.
- **Criterio de aceptación**: GIVEN un repo sin remoto y `merge.push: true` en `delegate` · WHEN el cierre llega al
  paso 10 · THEN el script se invoca una sola vez y el mensaje final dice «push: no hecho: sin remoto».

### 2. El revisor final va siempre con el techo del kit, sea cual sea el tamaño del diff

- **Qué pasó**: `encargo-revision.md` fija `sdd-kit:effort-high` + `model: opus` para el revisor final. El diff eran
  89 líneas: dos cambios de versión, el lockfile y una fila de docs. La instrucción global del usuario pide el modelo
  más barato que dé calidad y prevalece sobre las skills, así que despaché Sonnet con `effort-medium` y lo registré
  como ruling.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, «Revisor final».
- **Por qué el kit no lo evitó**: el despacho no depende del tamaño ni del modo. La review de spec sí es
  proporcional (`review-spec.md`), y la final no.
- **Coste**: bajo en esta sesión, porque hubo que decidir y justificar un ruling. En otras, el techo del kit
  aplicado a diffs triviales.
- **Propuesta**: una escala para el revisor final. Por ejemplo, en modo lite con un diff de menos de ~150 líneas
  y sin migración, `effort-medium` + gama media. Y dejar el techo para full o para un diff grande.
- **Criterio de aceptación**: GIVEN una feature lite con un diff de 89 líneas sin migración · WHEN se despacha el
  revisor final · THEN el encargo usa la escala proporcional sin registrar un ruling.

### 3. La receta del merge cita un «gate de merge» en `tech-stack.md` §Testing que el proyecto no tiene

- **Qué pasó**: `-VerifyCommand` tenía que ser «el gate de merge que declara `tech-stack.md` §Testing». El
  `tech-stack.md` del proyecto no tiene esa sección. Improvisé el gate de la constitution (`backend:test` +
  `frontend:check`).
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «El merge es un script», punto
  `-VerifyCommand`.
- **Por qué el kit no lo evitó**: la receta no dice qué hacer si la sección falta, y la plantilla de tech-stack (o
  el init) no garantiza que exista.
- **Coste**: bajo. Una búsqueda y una decisión sin respaldo escrito.
- **Propuesta**: un orden de búsqueda: tech-stack §Testing → el gate de cierre de la constitution → preguntar. O que
  `sdd-config` guarde `merge.verifyCommand`.
- **Criterio de aceptación**: GIVEN un proyecto sin §Testing en `tech-stack.md` y con el gate en la constitution ·
  WHEN el cierre invoca el script · THEN `-VerifyCommand` sale de la constitution y el mensaje final dice de dónde.

### 4. La cita literal de la validación rompe el corrector ortográfico del gate de docs

- **Qué pasó**: el walkthrough exige la frase literal del dev-lead. La frase traía erratas («despues»,
  «cerrart»), y `root:lint-md` (cspell) falló. Lo resolví con `<!-- cspell:ignore … -->` en el propio fichero.
- **Dónde en el kit**: `skills/sdd-templates/templates/walkthrough-template.md`, §4.2, y el paso 1 de
  `skills/sdd-end-feature/SKILL.md`.
- **Por qué el kit no lo evitó**: el kit pide literalidad y no prevé que el proyecto pase un corrector sobre los
  `.md`.
- **Coste**: bajo. Una vuelta de lint y la tentación de «corregir» la cita, que la invalidaría.
- **Propuesta**: una línea en la plantilla: «la cita no se corrige; si el proyecto pasa un corrector, se excluyen
  sus palabras localmente (en cspell, `<!-- cspell:ignore … -->`)».
- **Criterio de aceptación**: GIVEN una validación con erratas y un gate con cspell · WHEN se escribe el
  walkthrough · THEN la cita queda literal y el lint pasa a la primera.

### 5. En lite sin delta de capacidad, «una fila por THEN» no tiene THEN que contar

- **Qué pasó**: la spec declaró «Capacidades: Ninguna, porque es de herramientas» y no tenía escenarios. El paso 7
  y la §4.2 del walkthrough piden una fila por THEN. Usé como filas las comprobaciones del «Approach».
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 7 (smoke) y `walkthrough-template.md` §4.2.
- **Por qué el kit no lo evitó**: la regla supone que todo cambio con verificación tiene escenarios.
- **Coste**: bajo. Una decisión de forma sin respaldo.
- **Propuesta**: «sin delta de capacidad, una fila por comprobación del Approach, con la misma evidencia
  (`suite` · `ejecución real` · `no probado`)».
- **Criterio de aceptación**: GIVEN una spec con «Capacidades: Ninguna» · WHEN se presenta la validación · THEN el
  smoke tiene una fila por comprobación del Approach sin que el agente lo decida.

## Lo que hice por iniciativa propia

- En una subida de dependencia sin notas por paquete, saqué el changelog de comparar los dos `.tgz` de `npm pack`
  (`git diff --no-index` de `src/` y `.d.ts`). Resolvió la incertidumbre en minutos y fue la base de las
  decisiones de la spec. Candidato a nota en `sdd-start-feature` para las features de subida de versión.
- Antes de proponer el modo, avisé de que los tests que pedía el enunciado sustituían la librería con un mock y no
  probaban la subida, y moví la prueba a la e2e y a un smoke real. Candidato a regla general: una subida de
  versión se verifica con algo que cargue la versión nueva de verdad.
- Guardé en el walkthrough que la validación del dev-lead no cubría el plugin, en vez de darla por total.

## Funcionó, no tocar

- La opción «apruebo la spec por delegación» en la primera pregunta: una parada menos y ningún gate perdido.
- La regla de parar por PID o por puerto y comprobar después que el puerto quedaba libre. El `dotnet run` era un
  lanzador, y parar por el puerto fue lo correcto.
- `Measure-SessionTokens.ps1` y `Build-EstimationLog.ps1`: sin retoques y a la primera.
- Que `Invoke-SddMerge.ps1` compruebe el push antes de fusionar: el fallo del hallazgo 1 no dejó nada a medias.

## Errores míos, no huecos del kit

- `Set-Content -NoNewline` dentro de una línea compuesta falló con «A parameter cannot be found»; lo resolví
  con `Edit`.
- La primera comprobación de `VERSION` del cliente en el navegador cogió otro recurso, porque la ruta del worktree
  también contenía el nombre del paquete.
